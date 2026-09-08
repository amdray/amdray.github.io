# amdray portfolio

Static portfolio template for GitHub Pages. No build step and no external dependencies.

## Add a project

Edit `projects.json` and append one object:

```json
{
  "name": "Project name",
  "description": "One or two short sentences.",
  "status": "WIP",
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

All fields except `name` are optional. Empty links are not rendered. If `image` is empty, the card shows a neutral placeholder.

`featured: true` moves a project above non-featured projects. Project tags automatically become filter buttons.
