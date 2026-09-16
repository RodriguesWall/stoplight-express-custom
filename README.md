# stoplight-express-custom

Express middleware that serves [Stoplight Elements](https://stoplight.io/open-source/elements) API docs from a Swagger 2 / OpenAPI document (same shape as `swagger-ui-express`).

Every script and stylesheet is **bundled in the package and served by your own app**. There is no CDN, no remote font/JS fetch, and no inline `<script>` — the browser only loads assets from the same origin as the docs. That makes the UI a good fit for APIs behind a strict Content-Security-Policy (for example `script-src 'self'` without `'unsafe-inline'` or extra host allowlists).

**npm:** [stoplight-express-custom](https://www.npmjs.com/package/stoplight-express-custom)

## Install

```bash
yarn add stoplight-express-custom
# or
npm install stoplight-express-custom
```

**Peer dependency:** `express` >= 4

### Alternative (GitHub)

```bash
# Yarn 4
yarn add stoplight-express-custom@github:RodriguesWall/stoplight-express-custom

# npm / Yarn classic
npm install git+https://github.com/RodriguesWall/stoplight-express-custom.git
```

## Quick start

```js
const express = require('express')
const stoplightExpress = require('stoplight-express-custom')
const swaggerDocument = require('./swagger.json') // or your OpenAPI object

const app = express()

app.use(
  stoplightExpress({
    title: 'My API Documentation',
    export: true,
    // poweredBy omitted → footer hidden
    config: swaggerDocument,
  })
)

app.listen(3000)
```

TypeScript / ESM:

```ts
import express from 'express'
import stoplightExpress from 'stoplight-express-custom'
import swaggerDocument from './docs/swagger'

app.use(
  stoplightExpress({
    title: 'MPS API Documentation',
    export: true,
    poweredBy: 'powered by Mailspike', // optional; omit or "" to hide
    config: swaggerDocument,
  })
)
```

Then open:

| URL | What |
| --- | --- |
| `/docs` | Stoplight Elements UI |
| `/docs/swagger.json` | Spec JSON |
| `/docs/assets/*` | Elements static assets |

Every URL lives under `docsPath`, and the HTML references them with **relative**
URLs. A single reverse-proxy rule for `/docs*` is enough, and the docs keep working
when the proxy serves them under a prefix (`https://host/api/docs`).

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `object` | **required** | Swagger 2 / OpenAPI document |
| `title` | `string` | `"API Documentation"` | HTML `<title>` |
| `export` | `boolean` | `true` | Show OpenAPI export button (`false` → `hideExport`) |
| `poweredBy` | `string` | `""` (hidden) | Footer text. Omit or empty → no footer. Example: `"powered by Mailspike"` |
| `docsPath` | `string` | `"/docs"` | Docs UI path |
| `swaggerPath` | `string` | `` `${docsPath}/swagger.json` `` | Spec JSON path. An absolute path outside `docsPath` opts out of relative URLs |
| `assetsPath` | `string` | `` `${docsPath}/assets` `` | CSS/JS static path. An absolute path outside `docsPath` opts out of relative URLs |
| `router` | `"hash" \| "history" \| "memory"` | `"hash"` | Elements router |
| `layout` | `"sidebar" \| "stacked"` | `"sidebar"` | Elements layout |
| `theme` | `"dark" \| "light" \| "system"` | `"dark"` | Initial color theme. `"system"` follows the OS preference |
| `themeToggle` | `boolean` | `true` | Show the floating dark/light toggle button |

## Theme

The docs render in **dark** mode by default, and a round toggle button in the
bottom-right corner switches between dark and light:

```js
stoplightExpress({
  config: swaggerDocument,
  theme: 'dark', // "dark" (default) | "light" | "system"
  themeToggle: true, // false → no button, `theme` is always enforced
})
```

- The visitor's choice is stored in `localStorage` and wins over `theme` on later
  visits. With `themeToggle: false` the stored value is ignored and `theme` always applies.
- The theme is applied on `<html data-theme="...">` before the first paint, so there
  is no flash of the wrong theme on load.
- `system` resolves in the browser; server-rendered HTML starts from `dark` so the
  page still looks right with JavaScript disabled.

## Publishing updates

Bump `version` in `package.json`, then:

```bash
npm publish --access public
```

Consumers:

```bash
yarn up stoplight-express-custom
# or
yarn add stoplight-express-custom@^0.4.0
```

## Notes

- `config` must be a plain object (Swagger 2 or OpenAPI 3). Mutating it after mount (e.g. `info.version`) still works if you pass the same object reference.
- Assets are served from the package `static/` folder (`elements.min.js` / `elements.min.css` / `base.css` / `theme.js`). See [Local assets and CSP](#local-assets-and-csp).
- `poweredBy` is injected via `<docsPath>/assets/powered-by.js` (external script). Omit or pass `""` to hide the footer; there is no “powered by Stoplight” label by default.
- Your reverse proxy only needs to forward **`/docs`** and everything under it to the Node process. Prefix rewrites (`/api/docs` → `/docs`) are supported — the page resolves its own assets relative to the URL the browser used.

## License

MIT

Repo: [RodriguesWall/stoplight-express-custom](https://github.com/RodriguesWall/stoplight-express-custom)
