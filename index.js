'use strict'

const path = require('path')
const express = require('express')

/**
 * @typedef {object} StoplightExpressOptions
 * @property {string} [title]
 * @property {boolean} [export] Show the OpenAPI export button (default true)
 * @property {object} config Swagger 2 / OpenAPI document (same shape as swagger-ui)
 * @property {string} [docsPath]
 * @property {string} [swaggerPath]
 * @property {string} [assetsPath]
 * @property {'hash'|'history'|'memory'} [router]
 * @property {'sidebar'|'stacked'} [layout]
 */

/**
 * @param {StoplightExpressOptions} options
 * @returns {import('express').Router}
 */
function stoplightExpressCustom(options = {}) {
    const {
        title = 'API Documentation',
        export: showExport = true,
        config,
        docsPath = '/docs',
        swaggerPath = '/swagger.json',
        assetsPath = '/docs-assets',
        router: elementsRouter = 'hash',
        layout = 'sidebar',
    } = options

    if (!config || typeof config !== 'object') {
        throw new Error('stoplight-express-custom: `config` (swagger/OpenAPI document) is required')
    }

    const staticDir = path.join(__dirname, 'static')
    const appRouter = express.Router()

    appRouter.use(assetsPath, express.static(staticDir))

    appRouter.get(swaggerPath, (_req, res) => {
        res.json(config)
    })

    appRouter.get(docsPath, (_req, res) => {
        const hideExportAttr = showExport === false ? '\n          hideExport' : ''
        const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="${assetsPath}/elements.min.css">
    <style>html, body { height: 100%; margin: 0; }</style>
  </head>
  <body>
    <elements-api
      apiDescriptionUrl="${swaggerPath}"
      router="${escapeHtml(elementsRouter)}"
      layout="${escapeHtml(layout)}"${hideExportAttr}
    ></elements-api>
    <script src="${assetsPath}/elements.min.js"></script>
  </body>
</html>`
        res.type('html').send(html)
    })

    return appRouter
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
