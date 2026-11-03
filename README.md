# niheshr.com

Personal site of Nihesh Rachakonda, AI Engineer. One static page (projects, work, achievements, skills, photos, contact icons in the footer) plus a 404. Built with Astro and Tailwind CSS 4. Ships no JavaScript bundle: a few small inline scripts handle the theme toggle, the hero scroll intro, the `R` résumé shortcut, scroll reveals and the photo lightbox.

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve dist/ locally
pnpm check      # astro check
```

Deployed on Vercel from `main`. `vercel.json` sets the framework, build command, security headers, long caching for `/_astro/*`, and redirects the old `/minimal` and `/gooey` routes to `/`. The previous Vite site lives on the `archive/vite-2025` branch.

## Where to edit content

Everything on the page comes from typed files in `src/data/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, role, intro line, email, résumé path, OG image, socials, nav, SEO text |
| `projects.ts` | Project list in page order. Each row links to `live` if set, otherwise `github` |
| `experience.ts` | Work and achievements |
| `skills.ts` | Skill groups |
| `photos.ts` | Photo grid. `full` points at the higher quality file used in the lightbox |
| `signature.ts` | The "Nihesh" signature SVG path, shared by the hero and the OG image |

Photos live in `src/assets/photos/` so Astro can turn them into responsive AVIF/WebP at build time (high quality versions in `src/assets/photos/hi/`).

Static files that must keep their URLs live in `public/`: `/resume/v*.pdf`, `/og.png`, `robots.txt`, `sitemap.xml`.

### New résumé

Add it as the next version in `public/resume/` (currently `v8.pdf`) and change `site.resume`. The hero button, footer link and `R` key all read from there. Older versions stay so old links keep working.

### OG image

`public/og.png` (1200x630) is a screenshot of `src/pages/[og].astro`, a template that only exists in `pnpm dev`. To change it, edit the template, open http://localhost:4321/og, and save a 1200x630 screenshot over `public/og.png`.

## Design notes

- Type: Newsreader (variable, self-hosted through Astro's fonts API, preloaded, `font-display: swap`).
- The hero name is Nihesh's own signature, traced to one SVG path. On load it fills the screen as an outline; scrolling shrinks it into place and fills it with ink. Skipped under `prefers-reduced-motion`.
- Colour: cool paper and graphite ink in light mode, slate in dark mode. Tokens are at the top of `src/styles/global.css`.
- Kept deliberately plain: no screenshots on projects, no scroll hints, contact as icons only.

## Content rule

Copy comes from Nihesh or the résumé (`public/resume/v8.pdf`). Don't invent descriptions, dates, education or numbers, and don't add counts, star numbers or prize money.
