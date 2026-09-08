const projectsElement = document.querySelector("#projects");
const filtersElement = document.querySelector("#filters");
const countElement = document.querySelector("#project-count");
const errorElement = document.querySelector("#load-error");
const toolbarElement = document.querySelector("#toolbar");
const languageButtons = document.querySelectorAll("[data-language]");

const translations = {
  en: {
    pageTitle: "amdray — projects",
    pageDescription: "Projects by amdray",
    eyebrow: "Projects",
    heroTitle: "Hardware, homebrew, emulation and reverse engineering.",
    heroCopy: "Personal projects, experiments and research.",
    filtersLabel: "Project filters",
    technologiesLabel: "Technologies",
    keyIdea: "Key idea",
    all: "All",
    noImage: "No image",
    loadError: "Could not load projects.json.",
    projectOne: "project",
    projectMany: "projects",
    categoryLabels: {
      Embedded: "Embedded",
      Emulation: "Emulation",
      Games: "Games",
      Messaging: "Messaging",
      Music: "Music",
      "Reverse Engineering": "Reverse engineering"
    },
    links: {
      github: "GitHub",
      page: "Details",
      demo: "Demo",
      video: "Video",
      website: "Website"
    }
  },
  ru: {
    pageTitle: "amdray — проекты",
    pageDescription: "Проекты amdray",
    eyebrow: "Проекты",
    heroTitle: "Железо, homebrew, эмуляция и реверс-инжиниринг.",
    heroCopy: "Личные проекты, эксперименты и исследования.",
    filtersLabel: "Фильтры проектов",
    technologiesLabel: "Технологии",
    keyIdea: "Ключевая идея",
    all: "Все",
    noImage: "Нет изображения",
    loadError: "Не удалось загрузить projects.json.",
    projectOne: "проект",
    projectFew: "проекта",
    projectMany: "проектов",
    categoryLabels: {
      Embedded: "Встраиваемые системы",
      Emulation: "Эмуляция",
      Games: "Игры",
      Messaging: "Мессенджеры",
      Music: "Музыка",
      "Reverse Engineering": "Реверс-инжиниринг"
    },
    links: {
      github: "GitHub",
      page: "Подробнее",
      demo: "Демо",
      video: "Видео",
      website: "Сайт"
    }
  }
};

document.querySelector("#year").textContent = new Date().getFullYear();

let allProjects = [];
let activeFilter = "__all__";

function detectBrowserLanguage() {
  const languages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "en"];
  return languages.some(language => String(language).toLowerCase().startsWith("ru")) ? "ru" : "en";
}

function getInitialLanguage() {
  const saved = localStorage.getItem("portfolio-language");
  if (saved === "en" || saved === "ru") return saved;
  return detectBrowserLanguage();
}

let currentLanguage = getInitialLanguage();

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function localized(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[currentLanguage] ?? value.en ?? value.ru ?? "";
  }
  return value ?? "";
}

function projectCountText(count) {
  const t = translations[currentLanguage];
  if (currentLanguage === "en") {
    return `${count} ${count === 1 ? t.projectOne : t.projectMany}`;
  }

  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${t.projectOne}`;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return `${count} ${t.projectFew}`;
  return `${count} ${t.projectMany}`;
}

function projectLinks(project) {
  const t = translations[currentLanguage];
  const links = ["github", "page", "demo", "video", "website"];

  return links
    .filter(key => project[key])
    .map(key => `
      <a class="project-link" href="${escapeHtml(project[key])}" target="_blank" rel="noreferrer">${escapeHtml(t.links[key])}</a>
    `)
    .join("");
}

function projectCard(project) {
  const t = translations[currentLanguage];
  const image = project.image
    ? `<img class="project-image" src="${escapeHtml(project.image)}" alt="" loading="lazy">`
    : `<div class="project-image-placeholder" aria-hidden="true">${escapeHtml(t.noImage)}</div>`;

  const tags = Array.isArray(project.tags)
    ? project.tags.map(tag => `<li class="project-tag">${escapeHtml(tag)}</li>`).join("")
    : "";

  const links = projectLinks(project);
  const description = localized(project.description);
  const highlight = localized(project.highlight);
  const status = localized(project.status);

  return `
    <article class="project-card">
      ${image}
      <div class="project-body">
        <div class="project-topline">
          <h2 class="project-title">${escapeHtml(project.name)}</h2>
          ${status ? `<span class="project-status">${escapeHtml(status)}</span>` : ""}
        </div>
        <p class="project-description">${escapeHtml(description)}</p>
        ${highlight ? `
          <div class="project-highlight">
            <span class="project-highlight-label">${escapeHtml(t.keyIdea)}</span>
            <p>${escapeHtml(highlight)}</p>
          </div>
        ` : ""}
        ${tags ? `<ul class="project-tags" aria-label="${escapeHtml(t.technologiesLabel)}">${tags}</ul>` : ""}
        ${links ? `<div class="project-links">${links}</div>` : ""}
      </div>
    </article>
  `;
}

function renderProjects() {
  const projects = activeFilter === "__all__"
    ? allProjects
    : allProjects.filter(project => (project.categories || []).includes(activeFilter));

  projectsElement.innerHTML = projects.map(projectCard).join("");
  countElement.textContent = projectCountText(projects.length);
}

function renderFilters() {
  const categories = [...new Set(allProjects.flatMap(project => project.categories || []))].sort();
  const filters = ["__all__", ...categories];
  const t = translations[currentLanguage];

  filtersElement.innerHTML = filters.map(filter => {
    const label = filter === "__all__"
      ? t.all
      : (t.categoryLabels[filter] ?? filter);
    return `
      <button class="filter-button${filter === activeFilter ? " is-active" : ""}" type="button" data-filter="${escapeHtml(filter)}">
        ${escapeHtml(label)}
      </button>
    `;
  }).join("");
}

function applyLanguage() {
  const t = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]').setAttribute("content", t.pageDescription);
  document.querySelector("#hero-eyebrow").textContent = t.eyebrow;
  document.querySelector("#hero-title").textContent = t.heroTitle;
  document.querySelector("#hero-copy").textContent = t.heroCopy;
  toolbarElement.setAttribute("aria-label", t.filtersLabel);
  errorElement.textContent = t.loadError;

  languageButtons.forEach(button => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderFilters();
  renderProjects();
}

languageButtons.forEach(button => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    if (language !== "en" && language !== "ru") return;
    currentLanguage = language;
    localStorage.setItem("portfolio-language", language);
    applyLanguage();
  });
});

filtersElement.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderProjects();
});

async function loadProjects() {
  try {
    const response = await fetch("projects.json?v=20260908-3", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("projects.json must contain an array");

    allProjects = data
      .filter(project => project && project.name)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

    applyLanguage();
  } catch (error) {
    console.error(error);
    applyLanguage();
    errorElement.hidden = false;
    countElement.textContent = "";
  }
}

loadProjects();
