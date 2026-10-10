# MellowMates

A responsive React + Vite quiz experience for best friends, couples, and chosen family.

## Run locally

1. Install Node.js (LTS).
2. Open this folder in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Included

- Custom SVG teddy mascots and a lightweight animated background with characters running past cave portals.
- Bestie and Couple quiz presets, editable questions, and encoded shareable quiz URLs.
- Name entry requires an explicit button tap; Enter won't prematurely start the quiz.
- Result score, certificate download, score copy, WhatsApp sharing, and native share-sheet options for Instagram/Snapchat where supported.
- Mobile responsive layouts and reduced-motion accessibility support.

## Share-link note

Quiz links are generated from the current site URL. To share with people on other devices, deploy the site to a public HTTPS host (for example, Netlify, Vercel, or GitHub Pages with appropriate SPA settings). A localhost URL only works on your own device. Instagram/Snapchat do not offer a universal web URL for pre-filling arbitrary story content; on supported phones the system share sheet opens, otherwise the score text is copied so it can be pasted into the app.

## Build

Run `npm run build` to create the production bundle in `dist/`.
