# NEXUS — The Hidden City

A 3D exploration game for the browser. Plain HTML, CSS and JavaScript with Three.js (loaded from a CDN import map). No build step, no backend, no paid assets. Everything is procedural geometry and Web Audio synth.

## Run locally

ES modules do not load from `file://`, so serve the folder over HTTP:

```bash
cd nexus
python3 -m http.server 8000
```

Open <http://localhost:8000>. (Any static server works: `npx serve`, VS Code Live Server, etc.)

## Publish free on GitHub Pages

1. Create a new public repository on GitHub.
2. Upload `index.html`, `style.css`, `main.js` and `README.md` to the repository root.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After a minute your game is live at `https://<your-user>.github.io/<repo>/`.

## Controls

| | Desktop | Mobile |
|---|---|---|
| Move | WASD / arrows | Virtual joystick |
| Look | Drag with mouse | Drag on screen |
| Run | Shift | RUN (toggle) |
| Jump | Space | JUMP |
| Interact | E | ACT or tap the prompt |
| Menu (map, inventory, settings) | Esc | MENU |
| Mute | M | Settings |

## Missions

1. Discover the central hologram.
2. Find the hidden access card (use the plaza terminal, follow the magenta line).
3. Unlock the underground laboratory.
4. Collect three digital artifacts (two in the library, one in the lab).
5. Activate the ancient portal, which opens a secret area with the Nexus Core ending.

Progress is stored in `localStorage` (`nexus-save`, `nexus-set`). **Menu → Reset progress** clears it.

## Notes

- Graphics Low / Medium / High change pixel ratio and particle count. Mobile defaults to Low.
- Not implemented: bloom, planar reflections and shadows. Streets use a low-roughness material for a wet look instead.
- Three.js is pinned to 0.160.0 in the import map in `index.html`.
