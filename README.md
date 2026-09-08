# amdray portfolio

Static GitHub Pages portfolio. No build step and no external dependencies.

## Add a project

Projects are defined in `projects.json`. Add one object per project:

```json
{
  "name": "Project name",
  "description": {
    "en": "Short project description.",
    "ru": "Краткое описание проекта."
  },
  "highlight": {
    "en": "The main technical feature or value of the approach.",
    "ru": "Главная техническая особенность или ценность подхода."
  },
  "status": {
    "en": "Released",
    "ru": "Выпущен"
  },
  "tags": ["PSP", "C"],
  "image": "assets/projects/project-name.jpg",
  "github": "https://github.com/amdray/repository",
  "page": "",
  "demo": "",
  "video": "",
  "website": "",
  "year": 2026,
  "featured": false
}
```

`name` is required. Empty optional links are not rendered. If `image` is empty, the card shows a neutral placeholder. `featured: true` moves a project above non-featured projects. Tags automatically become filter controls.

## Languages

The interface and localized project fields support English and Russian.

On the first visit, the site uses the browser language: Russian locales (`ru`, `ru-RU`, etc.) select Russian; all others select English. The `EN | RU` switch in the header overrides this choice, and the selected language is stored in `localStorage` for subsequent visits.

Localized fields currently used by project cards are:

- `description.en` / `description.ru`
- `highlight.en` / `highlight.ru`
- `status.en` / `status.ru`

## Project cards

Each card can contain:

- screenshot or image;
- project name and status;
- short description;
- `highlight` with the project's main technical feature or engineering value;
- tags;
- links to GitHub, details, demo, video or website.

The site files are `index.html`, `style.css`, `script.js` and `projects.json`.