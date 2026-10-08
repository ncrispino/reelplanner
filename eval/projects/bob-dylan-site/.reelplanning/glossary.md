# Glossary

One name per thing. A plan, a script or a storyboard uses these words and no synonyms. Add a row when a plan introduces a part; never rename a row (add the old name under "also called", then stop using it).

| Term | id (`system.json`) | Meaning | Also called (do not use) |
|---|---|---|---|
| Content | `content` | one YAML file per album, song and event under `content/`, checked by the validator | CMS, database |
| Data build | `build` | the script that resolves references and writes one `site.json` | compile step |
| Generator | `generator` | the Astro site that turns `site.json` into static pages: era, album, song, timeline | templates, frontend |
| Search | `search` | a prebuilt index loaded in the browser on first focus | search service |
| Hosting | `hosting` | static hosting with deploy on push and preview builds | server |
| Design | `design` | the design system: reading layout, reference layout, type ramp, image sizes | UI kit, theme |
| era | — | a named span of years grouping albums (for example 1965–1966) | period |
