# Memories in Pixels

A one-page static website for Memories in Pixels, a Kolkata-based wedding and prewedding photography brand. The site has no build step or server runtime.

## Repository layout

- `index.html` — page content, metadata, and structured data
- `style.css` — design and responsive layout
- `main.js` — interactive controls, gallery, booking links, and contact form
- `content.json` — portfolio categories, image references, and source Drive IDs
- `assets/images/wedding/` — wedding photographs in large, small, and thumbnail WebP sizes
- `assets/images/prewedding/` — prewedding photographs in the same three sizes
- `assets/images/other-events/` — other-event photographs in the same three sizes
- `assets/images/brand/`, `assets/images/comparison/`, `assets/images/scenes/` — other page images
- `assets/audio/` — original instrumental background loop

All photographs used by the site are included locally. Their Drive source IDs remain in `content.json`; image categories stay separate. The Walen “Apache Flute” MP3 is not included in this public repository because its published free license does not cover commercial websites or redistribution of the track file.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. The gallery loads `content.json` with `fetch`, so opening `index.html` directly as a `file://` page will not work reliably.

## Host

Upload the repository root as a static site. For Netlify or Cloudflare Pages, set the publish/output directory to the repository root (`.`) and leave the build command empty. For GitHub Pages, deploy the `main` branch from `/ (root)` in repository Settings → Pages. Relative asset paths work under either a domain root or a repository subpath.

Before making a production site indexable, set its final domain in your hosting provider and add a canonical URL, absolute Open Graph image URL, and sitemap for that domain. The existing page title, description, semantic headings, structured data, and `robots.txt` are host-independent. Do not point a sitemap at a temporary domain.

The site starts with sound off. The Play Music button uses the original instrumental loop in `assets/audio/`. The visitor number is explicitly a display-only value: it starts at 52 and changes to a value from 53 through 120 on refresh.

The supplied photographs and brand assets are for this website; this repository does not grant others permission to reuse them.
