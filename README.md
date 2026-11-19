# Forever Character Atlas

WoW Forever character armory — search by first and last name, show the official Blizzard portrait, and list equipped gear.

## Setup

1. Node.js 22+ (24 recommended)
2. Copy `.env.example` to `.env` and set:

```
BLIZZARD_CLIENT_ID=...
BLIZZARD_CLIENT_SECRET=...
```

3. Install and run:

```sh
npm i
npm run dev
```

Open the local URL Vite prints (default `http://localhost:8080`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm test` — run tests
