/*
 * This file is part of wecco.
 *
 * Copyright (c) 2019 - 2021 The wecco authors.
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

import {cpus, totalmem, arch, type} from "os"
import { Browser, Page, TestInfo, test as base } from "@playwright/test"

export interface Spec {
    prepare?: () => void | Promise<void>
    sample: () => number | Promise<number>
    cleanup?: () => void | Promise<void>
    iterations?: number
}

interface TestResult {
    info: TestInfo
    duration: number
    iterations: number
}

const defaultIterations = 1000

type Benchmark = (spec: Spec) => Promise<void>

export class Benchmarker {
    private results = [] as Array<TestResult>
    constructor (private readonly browser: Browser) {}

    async run (page: Page, info: TestInfo, spec: Spec) {
        if (spec.prepare) {
            await page.evaluate(spec.prepare)
        }

        const iterations = spec.iterations ?? defaultIterations

        let dur = 0
        for (let i = 0; i < iterations; i++) {
            dur += await page.evaluate(spec.sample)
        }

        if (spec.cleanup) {
            await page.evaluate(spec.cleanup)
        }

        this.results.push({
            info: info,
            duration: dur,
            iterations: iterations,
        })
    }
    
    printSummary () {
        console.log()
        console.log("BENCHMARK RESULTS")
        console.log(`OS: ${type()} ${arch}`)
        console.log(`CPU: ${cpus()[0].model}`)
        console.log(`Mem: ${(totalmem() / 1024 / 1024 / 1024).toFixed(0)}GB`)
        console.log(`Browser: ${this.browser.browserType().name()}`)
        this.results.forEach(r => 
            console.log(`${r.info.titlePath.slice(2).join(" ▶ ")} ⇒ ${r.duration.toFixed(2)}ms (${(r.duration / r.iterations).toFixed(4)}ms per iteration)`)
        )
        console.log()
    }
}

export const test = base.extend< { benchmark: Benchmark }, { benchmarker: Benchmarker }>({
    benchmarker: [async ({ browser }, use ) => {
        const benchmarker = new Benchmarker(browser)
  
        await use(benchmarker)

        benchmarker.printSummary()
    }, { scope: "worker" }],
  
    benchmark: async ({ page, benchmarker }, use, info) => {
      await page.goto('.')
      await use(benchmarker.run.bind(benchmarker, page, info))
    },
  })

