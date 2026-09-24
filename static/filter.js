/**
 * Sidebar endpoint filter.
 *
 * Elements' table of contents is a flat list of sibling rows under one container:
 * group headers (`<div title="…">`, no nested wrapper) and leaf endpoint links
 * (`<a class="ElementsTableOfContentsItem" href="#/paths/…">`) interleaved in
 * document order. A group's leaves only exist in the DOM after the group has been
 * clicked open (its chevron icon flips from `chevron-right` to `chevron-down`), so
 * filtering force-opens every group on the first keystroke (snapshotting which
 * ones were already open) and restores that snapshot once the query is cleared.
 */
;(function () {
    var HIDE_CLASS = 'sl-express-hide'
    var OVERVIEW_HREF = '#/'

    var root = document.querySelector('elements-api')
    if (!root) return

    var dataset = (document.currentScript && document.currentScript.dataset) || {}
    var placeholder = dataset.placeholder || 'Filter endpoints…'

    var input = null
    var container = null
    var expandedGroups = null
    var debounceTimer = null

    var observer = new MutationObserver(tryMount)
    observer.observe(root, { childList: true, subtree: true })
    tryMount()

    function tryMount() {
        if (input) return
        var heading = findHeading()
        if (!heading || !heading.parentElement) return
        mount(heading)
        observer.disconnect()
    }

    /** The literal section heading ("Endpoints") Elements renders above the tree. */
    function findHeading() {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        var node
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim().toLowerCase() === 'endpoints') return node.parentElement
        }
        return null
    }

    function mount(heading) {
        container = heading.parentElement

        input = document.createElement('input')
        input.type = 'search'
        input.placeholder = placeholder
        input.className = 'sl-express-filter'
        input.setAttribute('aria-label', placeholder)
        heading.insertAdjacentElement('afterend', input)

        // The TOC rows sit under a delegated mousedown/click handler (row selection,
        // `sl-select-none`) that calls preventDefault() and swallows the browser's
        // default focus-on-mousedown for any descendant, including this input since
        // it now lives inside that same subtree. Stop it at the source so typing works.
        ;['mousedown', 'click'].forEach(function (type) {
            input.addEventListener(type, function (e) {
                e.stopPropagation()
            })
        })

        input.addEventListener('input', function () {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(apply, 120)
        })
    }

    function groupToggles() {
        return Array.prototype.filter.call(container.children, function (el) {
            return el.tagName === 'DIV' && el.hasAttribute('title')
        })
    }

    function isOpen(toggle) {
        return !!toggle.querySelector('[data-icon="chevron-down"]')
    }

    /** Flat children, chunked into `{ toggle, leaves[] }` by document order. */
    function segment() {
        var groups = []
        var current = null
        Array.prototype.forEach.call(container.children, function (el) {
            if (el.tagName === 'DIV' && el.hasAttribute('title')) {
                current = { toggle: el, leaves: [] }
                groups.push(current)
            } else if (current && el.tagName === 'A' && el.getAttribute('href') !== OVERVIEW_HREF) {
                current.leaves.push(el)
            }
        })
        return groups
    }

    function matches(el, query) {
        return el.textContent.toLowerCase().indexOf(query) !== -1
    }

    function apply() {
        var query = input.value.trim().toLowerCase()
        var toggles = groupToggles()

        if (query && !expandedGroups) {
            expandedGroups = toggles.filter(isOpen)
            toggles.forEach(function (toggle) {
                if (!isOpen(toggle)) toggle.click()
            })
        }

        if (!query) {
            clearHidden()
            restoreGroups(toggles)
            return
        }

        segment().forEach(function (group) {
            var groupMatch = matches(group.toggle, query)
            var leafHits = group.leaves.filter(function (leaf) {
                return matches(leaf, query)
            })

            group.leaves.forEach(function (leaf) {
                hide(leaf, !(groupMatch || leafHits.indexOf(leaf) !== -1))
            })
            hide(group.toggle, !(groupMatch || leafHits.length > 0))
        })
    }

    function hide(el, shouldHide) {
        el.classList.toggle(HIDE_CLASS, shouldHide)
    }

    function clearHidden() {
        Array.prototype.forEach.call(container.children, function (el) {
            el.classList.remove(HIDE_CLASS)
        })
    }

    function restoreGroups(toggles) {
        if (!expandedGroups) return
        toggles.forEach(function (toggle) {
            var shouldBeOpen = expandedGroups.indexOf(toggle) !== -1
            if (shouldBeOpen !== isOpen(toggle)) toggle.click()
        })
        expandedGroups = null
    }
})()
