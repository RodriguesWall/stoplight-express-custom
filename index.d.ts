import { Router } from 'express'

export interface StoplightExpressOptions {
    /** HTML document title (default: "API Documentation") */
    title?: string
    /** Show OpenAPI export button (default: true) */
    export?: boolean
    /** Swagger 2 / OpenAPI document — same structure as swagger-ui-express */
    config: Record<string, unknown>
    /** Docs UI path (default: "/docs") */
    docsPath?: string
    /** Spec JSON path (default: "/swagger.json") */
    swaggerPath?: string
    /** Static assets path for Elements CSS/JS (default: "/docs-assets") */
    assetsPath?: string
    /** Elements router mode (default: "hash") */
    router?: 'hash' | 'history' | 'memory'
    /** Elements layout (default: "sidebar") */
    layout?: 'sidebar' | 'stacked'
}

declare function stoplightExpressCustom(options: StoplightExpressOptions): Router

export default stoplightExpressCustom
