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
    fingerprintOf,
} from "@atomist/sdm-pack-fingerprints";
import { ApiDefinition } from "./model";
import { UsedApiLocator } from "./UsedApiLocator";

export interface UsedApiFPData {
    api: string;
    versions: string | string[];
}

export function createApiUsageFingerprintAspect(
    api: string,
    apiDefinition: ApiDefinition): Aspect<string[]> {
    return {
        name: `api-usage-${api}`,
        displayName: `Used API versions for ${api}`,
        extract: async (p, pli) => {
            const usedApiExtractor = new UsedApiLocator(apiDefinition);
            const usedApis = await usedApiExtractor.locateUsedApis(p as LocalProject, pli);
            return fingerprintOf({type: `api-usage-${api}`, data: usedApis});
        },
        toDisplayableFingerprintName: name => name,
        toDisplayableFingerprint: fp => `API usage for ${api}: ${fp.data.length} occurrences`,
    };
}
