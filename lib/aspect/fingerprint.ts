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
    FP,
    sha256,
} from "@atomist/sdm-pack-fingerprints";

const apiUsage = "api-usage";

export function createApiUsageFingerprint(api: string, version: string): FP<{api: string, version: string}> {
    return {
        data: { api: api.toLowerCase(), version },
        type: apiUsage,
        version: "0.1.0",
        name: `api-usage:${api}:${version}`,
        sha: sha256(JSON.stringify(version)),
    };
}

export function createApiUsageListFingerprint(api: string, versions: string[]): FP<{api: string, versions: string[]}> {
    return {
        data: { api: api.toLowerCase(), versions },
        type: apiUsage,
        version: "0.1.0",
        name: `api-usage:${api}`,
        sha: sha256(JSON.stringify(versions)),
    };
}
