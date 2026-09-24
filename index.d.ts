import { Router } from 'express'

export interface StoplightExpressOptions {
    /** HTML document title (default: "API Documentation") */
    title?: string
    /** Show OpenAPI export button (default: true) */
    export?: boolean
    /**
     * Footer label under the sidebar (e.g. "powered by Mailspike").
     * Omit or pass `""` to hide the footer (default: hidden).
     */
    poweredBy?: string
    /** Swagger 2 / OpenAPI document — same structure as swagger-ui-express */
    config: Record<string, unknown>
    /** Docs UI path (default: "/docs") */
    docsPath?: string
    /**
     * Spec JSON path (default: `${docsPath}/swagger.json`).
     * Setting an absolute path outside `docsPath` opts out of relative URLs.
     */
    swaggerPath?: string
    /**
     * Static assets path for Elements CSS/JS (default: `${docsPath}/assets`).
     * Setting an absolute path outside `docsPath` opts out of relative URLs.
     */
    assetsPath?: string
    /** Elements router mode (default: "hash") */
    router?: 'hash' | 'history' | 'memory'
    /** Elements layout (default: "sidebar") */
    layout?: 'sidebar' | 'stacked'
    /**
     * Initial color theme (default: "dark"). `"system"` follows the OS preference.
     * A visitor's choice made with the toggle takes precedence on later visits.
     */
    theme?: 'dark' | 'light' | 'system'
    /**
     * Show the floating dark/light toggle (default: true).
     * When `false`, `theme` is always enforced and visitor choices are ignored.
     */
    themeToggle?: boolean
    /** Show the sidebar endpoint filter input (default: true) */
    search?: boolean
    /** Placeholder text for the filter input (default: "Filter endpoints…") */
    searchPlaceholder?: string
    /**
     * Per-method sidebar icon — circle (GET), square (POST), diamond (PUT/PATCH),
     * triangle (DELETE), colored to match the method-verb text (default: true)
     */
    methodIcons?: boolean
}

declare function stoplightExpressCustom(options: StoplightExpressOptions): Router

export default stoplightExpressCustom
