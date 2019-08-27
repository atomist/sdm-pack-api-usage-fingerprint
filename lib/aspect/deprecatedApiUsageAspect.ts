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

import { LocalProject } from "@atomist/automation-client";
import {
    Aspect,
    FP,
} from "@atomist/sdm-pack-fingerprints";
import { UsedApis } from "./model";
import { UsedApiExtractor } from "./UsedApiExtractor";

export interface DeprecatedApiFPData {
    api: string;
    version: string;
}

export function createDeprecatedApiUsageAspect(
    api: string,
    fingerprinter: (usedApis: UsedApis) => Array<FP<DeprecatedApiFPData>>): Aspect<DeprecatedApiFPData> {
    return {
        name: `deprecated-${api.toLowerCase()}-api-usage`,
        displayName: `Used deprecated API versions for ${api}`,
        extract: async (p, pli) => {
            const usedApiExtractor = new UsedApiExtractor();
            const usedApis = await usedApiExtractor.getUsedApis(p as LocalProject, pli);
            return fingerprinter(usedApis);
        },
        toDisplayableFingerprintName: name => name,
        toDisplayableFingerprint: fp => `deprecated api ${fp.data.api}: ${fp.data.version}`,
    };
}
