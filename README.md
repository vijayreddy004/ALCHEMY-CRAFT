# ALCHEMY-CRAFT

---

## Quick demo / inspiration

Original site (inspiration): Neal Agarwal — Infinite Craft. ([Neal.fun][1])

---

## Features

* Infinite / large 2D canvas to place tile/blocks.
* Click / drag to place and remove blocks from an inventory palette.
* Simple inventory UI with selectable block types.
* Local save/export support (simple JSON or image export — see `Usage`).
* Responsive HTML / CSS / JavaScript frontend (Backend folder included for optional persistence / APIs).

> Fill in or remove features above to match your exact implementation if you added extras (animations, multiplayer, account saves, advanced export, etc.).

---

## Tech stack

* Frontend: HTML, CSS, JavaScript (vanilla).
* Backend: optional Node.js / Express (if you implemented server-side save/load).
* Static-deploy friendly — can be hosted on GitHub Pages / Netlify / Vercel if only frontend is required.

---

## Getting started (local)

### Prerequisites

* Git
* Node.js & npm (only if you use the Backend or frontend build tools)

### Clone

```bash
git clone https://github.com/vijayreddy004/ALCHEMY-CRAFT.git
cd ALCHEMY-CRAFT
```

### If the project is purely static (Frontend folder contains `index.html`)

Open the file:

* Double-click `Frontend/index.html`, or
* Run a simple local server:

```bash
# from repo root
npx serve Frontend
# then open the URL shown, e.g. http://localhost:5000
```

### If the frontend/backend use npm scripts

```bash
# Frontend
cd Frontend
npm install
npm start        # or `npm run dev` depending on package.json

# Backend (optional)
cd ../Backend
npm install
npm run dev      # or `npm start`
```

Adjust ports/URLs in the frontend config if your backend runs on a different port.

---

## Usage

* Select a block type in the inventory.
* Click on the canvas to place a block.
* Use right-click / a modifier key (or the erase tool) to remove a block.
* Use save/export to persist your creation locally (JSON/image) or, if configured, to a backend endpoint.

(Exact controls depend on your implementation — update this part with your real keybindings and features.)

---

## Project structure (suggested)

```
ALCHEMY-CRAFT/
├─ Frontend/         # HTML/CSS/JS client
│  ├─ index.html
│  ├─ assets/
│  └─ src/
├─ Backend/          # optional server (API for save/load)
├─ README.md
└─ .gitignore
```

Update this tree to reflect your repository’s real contents.

---

## Deployment

* **Static only**: deploy `Frontend/` to GitHub Pages / Netlify / Vercel as a static site.
* **Fullstack**: host Backend on Render / Railway / Heroku and connect the frontend to its API.
* **Docker**: add a Dockerfile if you want a containerized production deployment.

---

## Contributing

Thanks — contributions welcome!

1. Fork the repo.
2. Create a branch: `git checkout -b feat/your-feature`.
3. Make changes, commit with descriptive message.
4. Push and open a Pull Request.

Please include screenshots or a short GIF for UI/UX changes and describe how to test your change.

---

## Roadmap (ideas)

* Clipboard sharing / permalinks to share creations.
* Image export (PNG) at arbitrary resolution.
* Server-side save/load and user accounts.
* More block types / particle effects / animations.

Add or remove items depending on what you plan to implement.

---

## License

This project is released under the **MIT License** — see `LICENSE` (or add one to the repo).

---

## Acknowledgements

* Inspired by **Neal Agarwal — Infinite Craft**. ([Neal.fun][1])
* Any third-party assets / icons used: add attribution here.

---

## Author

Vijay Reddy
Repo: `https://github.com/vijayreddy004/ALCHEMY-CRAFT`

---

