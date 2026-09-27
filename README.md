# RC Interior — website (React + Vite)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for hosting

```bash
npm run build
```

Upload everything inside the `dist/` folder to your hosting (e.g. `public_html`). Relative paths are used, so it also works from a sub-folder.

## Where to edit

| What | File |
| --- | --- |
| All text, phone numbers, clients, team, projects, testimonials | `src/data/content.js` |
| Colours, fonts, layout | `src/styles.css` (colour tokens are at the top, in `:root`) |
| Photos | `public/img/` (keep the same file name to replace one) |
| A section's layout | `src/components/<Section>.jsx` |

## Structure

```
src/
  App.jsx               page order, menu / lightbox state, anchor scrolling
  data/content.js       every piece of copy and data
  hooks/scroll.jsx      Lenis smooth scroll + useOnScroll() hook (also drives GSAP ScrollTrigger)
  hooks/motion.js       all GSAP motion: split-letter headings, curtain image reveals, parallax,
                        magnetic buttons, 3D tilt, velocity skew, colour shift, progress bar
  hooks/useInView.js    "has this entered the screen?" hook
  components/ui.jsx     Reveal, Line, Counter, Words, ParallaxImg, Btn, SectionHead
  components/*.jsx      one file per section (Hero, Studio, Services, Spaces, Work, …)
```

## Adding motion to new elements

No JS needed, just attributes:

| Attribute | Effect |
| --- | --- |
| `data-split` on a heading | letters slide up out of a mask when scrolled into view |
| `data-reveal` on an image block | curtain wipes up, photo settles from a zoom |
| `data-reveal="noimg"` | curtain only |
| `data-delay="0.2"` | delay (seconds) for a `data-reveal` |
| `<ParallaxImg strength={10}>` | image drifts and un-zooms while scrolling |

Buttons (`.btn`, `.round`) are magnetic and cards (`.card`, `.wcard`, `.member`) tilt automatically on desktop.

## Reduced motion

If the visitor's OS has animations turned off (Windows: Settings → Accessibility → Visual effects → Animation effects),
the browser asks sites to reduce motion. This site respects that: nothing moves, but headings and images still fade in.
To see the full motion on your own PC, switch **Animation effects** on.

The contact form has no server: it opens WhatsApp (or the email app) with the enquiry pre-filled.
