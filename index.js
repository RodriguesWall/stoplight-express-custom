'use strict'

const path = require('path')
const express = require('express')

/**
 * @typedef {object} StoplightExpressOptions
 * @property {string} [title]
 * @property {boolean} [export] Show the OpenAPI export button (default true)
 * @property {string} [poweredBy] Footer label; omit or empty to hide (default hidden)
 * @property {object} config Swagger 2 / OpenAPI document (same shape as swagger-ui)
 * @property {string} [docsPath]
 * @property {string} [swaggerPath]
 * @property {string} [assetsPath]
 * @property {'hash'|'history'|'memory'} [router]
 * @property {'sidebar'|'stacked'} [layout]
 * @property {'dark'|'light'|'system'} [theme] Initial color theme (default 'dark')
 * @property {boolean} [themeToggle] Show the dark/light toggle button (default true)
 */

/**
 * @param {StoplightExpressOptions} options
 * @returns {import('express').Router}
 */
function stoplightExpressCustom(options = {}) {
    const {
        title = 'API Documentation',
        export: showExport = true,
        poweredBy = '',
        config,
        docsPath = '/docs',
        swaggerPath,
        assetsPath,
        router: elementsRouter = 'hash',
        layout = 'sidebar',
        theme = 'dark',
        themeToggle = true,
    } = options

    if (!config || typeof config !== 'object') {
        throw new Error('stoplight-express-custom: `config` (swagger/OpenAPI document) is required')
    }

    const docsMount = normalizePath(docsPath)
    // Assets and spec default to living *under* docsPath so a single reverse-proxy
    // rule covers the whole docs UI, and so their URLs can be emitted as relative
    // references that survive any mount prefix the proxy adds or strips.
    const assetsMount = assetsPath ? normalizePath(assetsPath) : `${docsMount}/assets`
    const swaggerMount = swaggerPath ? normalizePath(swaggerPath) : `${docsMount}/swagger.json`

    const assetsRef = relativeTo(docsMount, assetsMount)
    const swaggerRef = relativeTo(docsMount, swaggerMount)

    const staticDir = path.join(__dirname, 'static')
    const appRouter = express.Router()
    const poweredByLabel = typeof poweredBy === 'string' ? poweredBy.trim() : ''
    const themeMode = theme === 'light' || theme === 'system' ? theme : 'dark'
    // `system` can only be resolved in the browser; `dark` keeps the page usable
    // when JavaScript is unavailable and theme.js never gets to correct it.
    const initialTheme = themeMode === 'light' ? 'light' : 'dark'

    // CSP-safe: external script (script-src 'self'), not inline
    appRouter.get(`${assetsMount}/powered-by.js`, (_req, res) => {
        res.type('application/javascript').send(
            `window.__STOPlIGHT_EXPRESS_POWERED_BY__=${JSON.stringify(poweredByLabel)};`
        )
    })

    appRouter.use(assetsMount, express.static(staticDir))

    appRouter.get(swaggerMount, (_req, res) => {
        res.json(config)
    })

    appRouter.get(docsMount, (req, res) => {
        const base = documentBase(req)
        const resolve = ref => escapeHtml(ref.startsWith('/') ? ref : `${base}${ref}`)
        const asset = name => resolve(`${assetsRef}/${name}`)
        const specUrl = resolve(swaggerRef)
        const hideExportAttr = showExport === false ? '\n          hideExport' : ''
        const html = `<!doctype html>
<html lang="en" data-theme="${initialTheme}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${asset('elements.min.css')}">
    <link rel="stylesheet" href="${asset('base.css')}">
    <script
      src="${asset('theme.js')}"
      data-default-theme="${themeMode}"
      data-toggle="${themeToggle === false ? 'false' : 'true'}"
    ></script>
  </head>
  <body>
    <elements-api
      apiDescriptionUrl="${specUrl}"
      router="${escapeHtml(elementsRouter)}"
      layout="${escapeHtml(layout)}"${hideExportAttr}
    ></elements-api>
    <script src="${asset('powered-by.js')}"></script>
    <script src="${asset('elements.min.js')}"></script>
  </body>
</html>`
        res.type('html').send(html)
    })

    return appRouter
}

function normalizePath(value) {
    const trimmed = String(value).trim().replace(/\/+$/, '')
    if (!trimmed) return ''
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/**
 * Reference from the docs page to `target`. Relative (so a reverse-proxy prefix is
 * preserved) when `target` sits under `from`, otherwise the absolute path.
 */
function relativeTo(from, target) {
    return target.startsWith(`${from}/`) ? target.slice(from.length + 1) : target
}

/**
 * Prefix that turns a relative reference into one resolved against the docs page
 * itself rather than its parent directory. Empty when the request already ends in
 * `/`, otherwise the page's own last path segment.
 */
function documentBase(req) {
    const url = String(req.originalUrl || req.url || '').split(/[?#]/)[0]
    if (!url || url.endsWith('/')) return ''
    return `${url.slice(url.lastIndexOf('/') + 1)}/`
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

module.exports = stoplightExpressCustom
module.exports.default = stoplightExpressCustom
