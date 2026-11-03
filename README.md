# niheshr.com (Astro)

Personal portfolio for Nihesh Rachakonda. One static page (projects, work, education, achievements, skills, photos, contact links in the footer) plus a 404. Built with Astro, Tailwind CSS 4 and almost no JavaScript: about 100 lines of inline vanilla JS for the theme toggle, the `R` résumé shortcut, scroll reveals and the photo lightbox.

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve dist/ locally (runs in the background, stop with `pnpm astro preview stop`)
pnpm check      # astro check (needs TypeScript 6; TS 7 isn't supported by astro check yet)
```

## Where to edit content

Everything on the page comes from typed files in `src/data/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, role, intro line, email, résumé path, socials, nav, SEO description |
| `projects.ts` | Project list, in page order. Add a project by adding one entry and importing its screenshot and logo |
| `experience.ts` | Jobs, education, achievements |
| `photos.ts` | Photo grid. `full` points at the higher quality file used in the lightbox |
| `skills.ts` | Skill groups |

Images live in `src/assets/` so Astro can turn them into responsive AVIF/WebP at build time. Put new screenshots in `src/assets/projects/`, photos in `src/assets/photos/` (and the high quality version in `src/assets/photos/hi/`).

Static files that must keep their URLs live in `public/` (`/resume/v1.pdf` to `/resume/v7.pdf`, `/nihesh.png`, `robots.txt`, `sitemap.xml`). To ship a new résumé, add it to `public/resume/` and change `site.resume`.

## Design notes

- Type: Newsreader (variable, self-hosted through Astro's fonts API, preloaded, `font-display: swap`). One family, no other web fonts.
- The hero name is Nihesh's own brush signature (originally `public/photography/3.png` in the old site), traced to a single SVG path with potrace and inlined in `src/components/Hero.astro`. It writes itself in left to right with a CSS mask on load, and stays still under `prefers-reduced-motion`.
- Colour: cool paper and graphite ink with a red accent in light mode; slate with a yellow accent in dark mode. Tokens are at the top of `src/styles/global.css`.
- Motion is CSS only and switches off under `prefers-reduced-motion`.

## Content rule

Copy on the page comes from the old site (`~/Nihesh/portfolio`) or the résumé (`public/resume/v7.pdf`). Don't add descriptions that aren't in one of those.
