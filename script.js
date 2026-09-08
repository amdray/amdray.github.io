const projectsElement = document.querySelector("#projects");
const filtersElement = document.querySelector("#filters");
const countElement = document.querySelector("#project-count");
const errorElement = document.querySelector("#load-error");

document.querySelector("#year").textContent = new Date().getFullYear();

let allProjects = [];
let activeFilter = "All";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function projectLinks(project) {
  const links = [
    ["github", "GitHub"],
    ["page", "Details"],
    ["demo", "Demo"],
    ["video", "Video"],
    ["website", "Website"]
  ];

  return links
    .filter(([key]) => project[key])
    .map(([key, label]) => `
      <a class="project-link" href="${escapeHtml(project[key])}" target="_blank" rel="noreferrer">${label}</a>
    `)
    .join("");
}

function projectCard(project) {
  const image = project.image
    ? `<img class="project-image" src="${escapeHtml(project.image)}" alt="" loading="lazy">`
    : `<div class="project-image-placeholder" aria-hidden="true">No image</div>`;

  const tags = Array.isArray(project.tags)
    ? project.tags.map(tag => `<li class="project-tag">${escapeHtml(tag)}</li>`).join("")
    : "";

  const links = projectLinks(project);

  return `
    <article class="project-card">
      ${image}
      <div class="project-body">
        <div class="project-topline">
          <h2 class="project-title">${escapeHtml(project.name)}</h2>
          ${project.status ? `<span class="project-status">${escapeHtml(project.status)}</span>` : ""}
        </div>
        <p class="project-description">${escapeHtml(project.description)}</p>
        ${tags ? `<ul class="project-tags" aria-label="Technologies">${tags}</ul>` : ""}
        ${links ? `<div class="project-links">${links}</div>` : ""}
      </div>
    </article>
  `;
}

function renderProjects() {
  const projects = activeFilter === "All"
    ? allProjects
    : allProjects.filter(project => (project.tags || []).includes(activeFilter));

  projectsElement.innerHTML = projects.map(projectCard).join("");
  countElement.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"}`;
}

function renderFilters() {
  const tags = [...new Set(allProjects.flatMap(project => project.tags || []))].sort();
  const filters = ["All", ...tags];

  filtersElement.innerHTML = filters.map(filter => `
    <button class="filter-button${filter === activeFilter ? " is-active" : ""}" type="button" data-filter="${escapeHtml(filter)}">
      ${escapeHtml(filter)}
    </button>
  `).join("");

  filtersElement.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeFilter = button.dataset.filter;
    renderFilters();
    renderProjects();
  }, { once: true });
}

async function loadProjects() {
  try {
    const response = await fetch("projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("projects.json must contain an array");

    allProjects = data
      .filter(project => project && project.name)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

    renderFilters();
    renderProjects();
  } catch (error) {
    console.error(error);
    errorElement.hidden = false;
    countElement.textContent = "";
  }
}

loadProjects();
