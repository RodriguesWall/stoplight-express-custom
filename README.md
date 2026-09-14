# stoplight-express-custom

Express middleware that serves [Stoplight Elements](https://stoplight.io/open-source/elements) API docs from a Swagger 2 / OpenAPI document (same shape as `swagger-ui-express`).

Bundles Elements CSS/JS locally — no CDN required.

## Install

**Yarn 4** (GitHub):

```bash
yarn add stoplight-express-custom@github:RodriguesWall/stoplight-express-custom
```

**npm / Yarn classic**:

```bash
npm install git+https://github.com/RodriguesWall/stoplight-express-custom.git
```

**Peer dependency:** `express` >= 4

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
    config: swaggerDocument,
  })
)
```

Then open:

| URL | What |
| --- | --- |
| `/docs` | Stoplight Elements UI |
| `/swagger.json` | Spec JSON |
| `/docs-assets/*` | Elements static assets |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `object` | **required** | Swagger 2 / OpenAPI document |
| `title` | `string` | `"API Documentation"` | HTML `<title>` |
| `export` | `boolean` | `true` | Show OpenAPI export button (`false` → `hideExport`) |
| `docsPath` | `string` | `"/docs"` | Docs UI path |
| `swaggerPath` | `string` | `"/swagger.json"` | Spec JSON path |
| `assetsPath` | `string` | `"/docs-assets"` | CSS/JS static path |
| `router` | `"hash" \| "history" \| "memory"` | `"hash"` | Elements router |
| `layout` | `"sidebar" \| "stacked"` | `"sidebar"` | Elements layout |

## Notes

- Mount with `app.use(...)` (no path prefix) so default routes stay at `/docs` and `/swagger.json`.
- `config` must be a plain object (Swagger 2 or OpenAPI 3). Mutating it after mount (e.g. `info.version`) still works if you pass the same object reference.
- Assets are served from the package `static/` folder (`elements.min.js` / `elements.min.css`).

## License

UNLICENSED

Repo: [RodriguesWall/stoplight-express-custom](https://github.com/RodriguesWall/stoplight-express-custom)
