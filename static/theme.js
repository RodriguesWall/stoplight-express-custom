/**
 * Theme bootstrap for the docs page.
 *
 * Loaded synchronously from <head> so the resolved theme is on <html> before the
 * first paint (no light flash).
 *
 * Two storage keys are involved. STORAGE_KEY holds the visitor's choice and is
 * only written by the toggle, so it can be trusted over the configured default.
 * ELEMENTS_KEY is Elements' own store (it reads `.mode` from there, falling back
 * to the `data-theme` attribute); it is written but never read, because a value
 * left behind by Elements itself — light by default — must not be mistaken for a
 * deliberate choice and override the configured theme.
 */
;(function () {
    var STORAGE_KEY = 'stoplight-express-custom:theme'
    var ELEMENTS_KEY = 'mosaic-theme'
    var SVG_NS = 'http://www.w3.org/2000/svg'
    // Outlines drawn with `currentColor`; each button shows the theme it switches to.
    var ICON = {
        light: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
        dark: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
    }

    var dataset = (document.currentScript && document.currentScript.dataset) || {}
    var defaultTheme = dataset.defaultTheme || 'dark'
    var toggleEnabled = dataset.toggle !== 'false'
    var root = document.documentElement

    apply(resolve(toggleEnabled ? storedTheme() || defaultTheme : defaultTheme), false)

    if (toggleEnabled) {
        whenReady(mountToggle)
    }

    function storedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY)
        } catch (error) {
            return null
        }
    }

    function persist(theme, remember) {
        try {
            localStorage.setItem(ELEMENTS_KEY, JSON.stringify({ mode: theme, version: 0 }))
            if (remember) localStorage.setItem(STORAGE_KEY, theme)
        } catch (error) {
            /* private mode / storage disabled — theme just won't survive a reload */
        }
    }

    /** Anything other than an explicit theme (`"system"`, stale values) follows the OS. */
    function resolve(theme) {
        if (theme === 'light' || theme === 'dark') return theme
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark'
    }

    function currentTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    }

    function apply(theme, remember) {
        root.setAttribute('data-theme', theme)
        root.style.colorScheme = theme
        persist(theme, remember)
    }

    function whenReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback)
        } else {
            callback()
        }
    }

    function mountToggle() {
        var button = document.createElement('button')
        button.type = 'button'
        button.className = 'sl-express-theme-toggle'
        button.appendChild(icon())
        describe(button)

        button.addEventListener('click', function () {
            apply(currentTheme() === 'dark' ? 'light' : 'dark', true)
            button.replaceChild(icon(), button.firstChild)
            describe(button)
        })

        document.body.appendChild(button)
    }

    function describe(button) {
        var next = currentTheme() === 'dark' ? 'light' : 'dark'
        button.title = 'Switch to ' + next + ' theme'
        button.setAttribute('aria-label', button.title)
    }

    /** Built with the DOM API rather than innerHTML so Trusted Types policies pass. */
    function icon() {
        var next = currentTheme() === 'dark' ? 'light' : 'dark'
        var svg = document.createElementNS(SVG_NS, 'svg')
        var path = document.createElementNS(SVG_NS, 'path')

        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('stroke-width', '1.6')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')
        svg.setAttribute('aria-hidden', 'true')
        path.setAttribute('d', ICON[next])
        svg.appendChild(path)

        return svg
    }
})()
