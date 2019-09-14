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
import { CodeTransform } from "@atomist/sdm";
import {
    Aspect,
    FP,
} from "@atomist/sdm-pack-fingerprints";
import { UsedApis } from "./model";
import { UsedApiExtractor } from "./UsedApiExtractor";

export interface UsedApiFPData {
    api: string;
    versions: string | string[];
}

export function createApiUsageFingerprintAspect(
    api: string,
    fingerprinter: (usedApis: UsedApis) => Array<FP<UsedApiFPData>> | FP<UsedApiFPData>,
    targetTransform: CodeTransform<{ fp: FP<UsedApiFPData> }>): Aspect<UsedApiFPData> {
    return {
        name: `api-usage-${api}`,
        displayName: `Used API versions for ${api}`,
        extract: async (p, pli) => {
            const usedApiExtractor = new UsedApiExtractor();
            const usedApis = await usedApiExtractor.getUsedApis(p as LocalProject, pli);
            return fingerprinter(usedApis);
        },
        apply: targetTransform,
        toDisplayableFingerprintName: name => name,
        toDisplayableFingerprint: fp => `API usage for ${fp.data.api}: ${fp.data.versions}`,
    };
}
