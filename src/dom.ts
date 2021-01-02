/*
 * This file is part of wecco.
 *
 * Copyright (c) 2019 - 2020 The wecco authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * `ElementUpdateFunction` defines a type for functions that updates an Elements's content.
 */
export interface ElementUpdateFunction {
    (host: Element): void
}

export interface ElementUpdater {
    updateElement(el: Element): void
}

export type ElementUpdate = string | Element | ElementUpdateFunction | ElementUpdater | Array<ElementUpdate>

export function updateElement (element: Element, request: ElementUpdate): void {
    if (Array.isArray(request)) {
        request.forEach(updateElement.bind(undefined, element))
    } else if (typeof(request) === "string") {
        const dummy = document.createElement("div")
        dummy.innerHTML = request
        dummy.childNodes.forEach(n => element.appendChild(dummy.removeChild(n)))
    } else if (request instanceof Element) {
        element.appendChild(request)
    } else if (isElementUpdater(request)) {
        request.updateElement(element)
    } else {
        request(element)
    }
}

function isElementUpdater (request: ElementUpdate): request is ElementUpdater {
    return "updateElement" in (request as any)
}

/**
 * Selector to resolve a Node inside the DOM.
 */
export type ElementSelector = string | Element

/**
 * Resolves the Element described by the given selector.
 * @param selector the selector
 * @param parent an optional parent to start resolving from. Defaults to `document.body`
 */
export function resolve(selector: ElementSelector, parent?: Element): Element {
    if (typeof selector !== "string") {
        return selector
    }

    if (!parent) {
        parent = document.body
    }

    return parent.querySelector(selector)
}

/**
 * Removes all child nodes from the given node.
 * @param node the node to remove children from
 */
export function removeAllChildren(node: Node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}