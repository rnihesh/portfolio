# niheshr.com (Astro)

Personal portfolio for Nihesh Rachakonda. One static page (projects, work, photographs, skills, contact) plus a 404. Built with Astro, Tailwind CSS 4 and almost no JavaScript: about 100 lines of inline vanilla JS for the theme toggle, the `R` résumé shortcut, scroll reveals and the photo lightbox.

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
| `site.ts` | Name, title, bio, email, résumé path, socials, nav, SEO description |
| `projects.ts` | Project list, in page order. Add a project by adding one entry and importing its screenshot and logo |
| `experience.ts` | Jobs, education, self-directed learning |
| `photos.ts` | Contact sheet. Each inner array is one film strip. `full` points at the higher quality file used in the lightbox; `pick: true` circles a frame |
| `skills.ts` | Skill groups |

Images live in `src/assets/` so Astro can turn them into responsive AVIF/WebP at build time. Put new screenshots in `src/assets/projects/`, photos in `src/assets/photos/` (and the high quality version in `src/assets/photos/hi/`).

Static files that must keep their URLs live in `public/` (`/resume/v1.pdf`, `/nihesh.png`, `robots.txt`, `sitemap.xml`). To ship a new résumé, replace `public/resume/v1.pdf` or change `site.resume`.

## Design notes

- Type: Newsreader (variable, self-hosted, preloaded) for everything, Shantell Sans for the handwritten notes. Both go through Astro's fonts API with `font-display: swap`. Shantell is subset to Basic Latin (`src/assets/fonts/shantell-sans-basic-wght.woff2`) to keep it under 40 KB; regenerate with `pyftsubset` if you need more characters.
- Colour: contact-sheet paper and graphite with a red china-marker accent in light mode; slate with a yellow marker in dark mode. Tokens are at the top of `src/styles/global.css`.
- Photos are laid out as strips of film with SVG sprocket holes, a hand-trimmed SVG `clipPath` on each frame and grease-pencil loops on the picks. Projects sit in 35mm slide mounts with an SVG clip for the window.
- Motion is CSS only and switches off under `prefers-reduced-motion`.
