/*
 * Copyright © 2019 Atomist, Inc.
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

import {
    configurationValue,
    LocalProject,
} from "@atomist/automation-client";
import {
    PushImpactListenerInvocation,
    spawnLog,
    StringCapturingProgressLog,
} from "@atomist/sdm";
import { UsedApis } from "./model";

export class UsedApiExtractor {
    private readonly scanToolPath: string;

    constructor() {
        this.scanToolPath = configurationValue<string>("sdm.aspect.deprecation.scanner.location");
    }

    public async getUsedApis(p: LocalProject, pli: PushImpactListenerInvocation): Promise<UsedApis> {
        return this.getUsedApisForCompleteProject(p);
    }

    private async getUsedApisForCompleteProject(p: LocalProject): Promise<UsedApis> {
        const log = new StringCapturingProgressLog();
        const result = await spawnLog("java", ["-jar", this.scanToolPath, "-s", p.baseDir], {
            log,
        });
        if (result.code === 0) {
           const output = log.log;
           const parsed = JSON.parse(output);
           return {
               methods: parsed.methods.map(m => ({ fqn: m})),
               annotations: parsed.annotations.map(m => ({ fqn: m})),
               classesOrInterfaces: parsed.classes.map(m => ({ fqn: m})),
           };
        } else {
            return Promise.reject("Could not get API usage results");
        }
    }
}
