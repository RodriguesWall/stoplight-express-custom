# stoplight-express-custom

Express middleware that serves [Stoplight Elements](https://stoplight.io/open-source/elements) API docs from a Swagger 2 / OpenAPI document (same shape as `swagger-ui-express`).

Bundles Elements CSS/JS locally — no CDN required.

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

## Publishing updates

Bump `version` in `package.json`, then:

```bash
npm publish --access public
```

Consumers:

```bash
yarn up stoplight-express-custom
# or
yarn add stoplight-express-custom@^0.3.0
```

## Notes

- `config` must be a plain object (Swagger 2 or OpenAPI 3). Mutating it after mount (e.g. `info.version`) still works if you pass the same object reference.
- Assets are served from the package `static/` folder (`elements.min.js` / `elements.min.css` / `base.css`).
- `poweredBy` is injected via `<docsPath>/assets/powered-by.js` (external script) so Content-Security-Policy `script-src 'self'` environments work — no inline `<script>`.
- By default there is **no** “powered by Stoplight” footer. Set `poweredBy` only when you want a custom label.
- Your reverse proxy only needs to forward **`/docs`** and everything under it to the Node process. Prefix rewrites (`/api/docs` → `/docs`) are supported — the page resolves its own assets relative to the URL the browser used.

## License

MIT

Repo: [RodriguesWall/stoplight-express-custom](https://github.com/RodriguesWall/stoplight-express-custom)
