/**
 * Per-method sidebar icon.
 *
 * Every TOC leaf renders the same purple bullseye regardless of HTTP method
 * (`<div title="…"><svg data-icon="bullseye">…</svg><div>Label</div>…`, first
 * child of the row). This swaps it for a method-shaped icon — circle/square/
 * diamond/triangle — colored via the same `sl-text-*` class Elements already
 * uses for the method-verb text, so it stays correct across the light/dark
 * override in base.css with no extra JS. The original icon is hidden (not
 * removed) since the row is a React-owned node that can re-render at any time;
 * removing a node React still thinks it owns risks a reconciliation error.
 * Runs continuously (never disconnects) because expanding/collapsing a group
 * unmounts and remounts its leaves, each time with a fresh stock icon.
 */
;(function () {
    var SVG_NS = 'http://www.w3.org/2000/svg'
    var HIDE_CLASS = 'sl-express-hide'
    var REPLACEMENT_CLASS = 'sl-express-method-icon'

    var METHOD_SHAPE = {
        get: { cls: 'sl-text-success', tag: 'circle', attrs: { cx: '12', cy: '12', r: '8' } },
        post: { cls: 'sl-text-primary', tag: 'rect', attrs: { x: '4', y: '4', width: '16', height: '16', rx: '2' } },
        put: { cls: 'sl-text-warning', tag: 'path', attrs: { d: 'M12 2 L22 12 L12 22 L2 12 Z' } },
        patch: { cls: 'sl-text-warning', tag: 'path', attrs: { d: 'M12 2 L22 12 L12 22 L2 12 Z' } },
        delete: { cls: 'sl-text-danger', tag: 'path', attrs: { d: 'M12 3 L21 20 L3 20 Z' } },
    }

    var root = document.querySelector('elements-api')
    if (!root) return

    new MutationObserver(scan).observe(root, { childList: true, subtree: true })
    scan()

    function scan() {
        Array.prototype.forEach.call(root.querySelectorAll('a.ElementsTableOfContentsItem'), upgrade)
    }

    function upgrade(link) {
        var row = link.firstElementChild
        if (!row || row.querySelector('.' + REPLACEMENT_CLASS)) return

        var original = row.querySelector('svg[data-icon="bullseye"]')
        if (!original) return

        var shape = METHOD_SHAPE[methodFromHref(link.getAttribute('href'))]
        if (!shape) return

        original.classList.add(HIDE_CLASS)
        original.insertAdjacentElement('afterend', buildIcon(shape))
    }

    /** Hash routes are `#/paths/<slug>/<method>`; `#/` (Overview) has no method. */
    function methodFromHref(href) {
        return href.slice(href.lastIndexOf('/') + 1).toLowerCase()
    }

    function buildIcon(shape) {
        var svg = document.createElementNS(SVG_NS, 'svg')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('width', '1em')
        svg.setAttribute('height', '1em')
        svg.setAttribute('aria-hidden', 'true')
        svg.setAttribute('focusable', 'false')
        svg.setAttribute('class', 'sl-icon ' + REPLACEMENT_CLASS + ' ' + shape.cls)

        var el = document.createElementNS(SVG_NS, shape.tag)
        Object.keys(shape.attrs).forEach(function (key) {
            el.setAttribute(key, shape.attrs[key])
        })
        el.setAttribute('fill', 'currentColor')
        svg.appendChild(el)
        return svg
    }
})()
