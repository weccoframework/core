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

import { expect } from "iko"
import { html } from "../../src/html"

describe("html.ts", async () => {
    afterEach(() => {
        document.body.innerHTML = ""
    })

    describe("html", () => {
        it("should create html w/o placeholder", () => {
            (html`<p>Hello, world</p>`).updateElement(document.body)

            expect(document.body.innerHTML).toBe("<p>Hello, world</p>")
        })

        it("should create html w/ placeholder", () => {
            const gretee = "world";

            (html`<p>Hello, ${gretee}</p>`).updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<p data-wecco-html-id="[a-z0-9]{6}">Hello, world<\/p>/)
        })

        it("should create html w/ toplevel placeholder", () => {
            const gretee = "world";

            (html`<p>Hello</p>${gretee}`).updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<p>Hello<\/p>world/)
        })

        it("should create html w/ multiple adjecent placeholder", () => {
            const message = "Hello, ";
            const gretee = "world";

            (html`<p>${message}${gretee}</p>`).updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<p data-wecco-html-id="[a-z0-9]{6}">Hello, world<\/p>/)
        })

        it("should create html w/ attribute placeholder", () => {
            const classes = "hero small"

            const template = (html`<p class=${classes}>Hello, world</p>`)
            template.updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<p class="hero small" data-wecco-html-id="[a-z0-9]{6}">Hello, world<\/p>$/)
        })

        it("should create html w/ boolean attribute placeholder set to false", () => {
            const disabled = false
            const template = (html`<a ?disabled=${disabled}>Hello, world</a>`)
            template.updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<a data-wecco-html-id="[a-z0-9]{6}">Hello, world<\/a>$/)
        })

        it("should create html w/ boolean attribute placeholder set to true", () => {
            const disabled = true
            const template = (html`<a ?disabled=${disabled}>Hello, world</a>`)
            template.updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<a data-wecco-html-id="[a-z0-9]{6}" disabled="disabled">Hello, world<\/a>$/)
        })

        it("should create html w/ event placeholder", () => {
            let clicked = false
            const callback = () => { clicked = true }

            const template = (html`<a @click=${callback}>Hello, world</a>`)
            template.updateElement(document.body)

            expect(document.body.innerHTML).toMatch(/^<a data-wecco-html-id="[a-z0-9]{6}">Hello, world<\/a>$/)

            document.querySelector("a").dispatchEvent(new MouseEvent("click"))
            expect(clicked).toBe(true)
        })
    })
})