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

import { CountAspect } from "@atomist/sdm-pack-aspect/lib/aspect/compose/commonTypes";
import {
    Aspect,
    fingerprintOf,
    FP,
} from "@atomist/sdm-pack-fingerprint";
import { createApiUsageFingerprintAspect } from "../../aspect/apiUsageFingerprintAspect";
import {
    Guava19DeprecatedApi,
    Guava20DeprecatedApi,
    Guava21DeprecatedApi,
    Guava22DeprecatedApi,
    Guava23DeprecatedApi,
} from "./guavaDeprecatedApiDefinitions";

export const Guava19DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-19-deprecated", Guava19DeprecatedApi);
export const Guava20DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-20-deprecated", Guava20DeprecatedApi);
export const Guava21DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-21-deprecated", Guava21DeprecatedApi);
export const Guava22DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-22-deprecated", Guava22DeprecatedApi);
export const Guava23DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-23-deprecated", Guava23DeprecatedApi);

export const Guava19DeprecatedApiCountAspect: CountAspect = createApiUsageFingerprintCountAspect("guava-19-deprecated");
export const Guava20DeprecatedApiCountAspect: CountAspect = createApiUsageFingerprintCountAspect("guava-20-deprecated");
export const Guava21DeprecatedApiCountAspect: CountAspect = createApiUsageFingerprintCountAspect("guava-21-deprecated");
export const Guava22DeprecatedApiCountAspect: CountAspect = createApiUsageFingerprintCountAspect("guava-22-deprecated");
export const Guava23DeprecatedApiCountAspect: CountAspect = createApiUsageFingerprintCountAspect("guava-23-deprecated");

function createApiUsageFingerprintCountAspect(api: string): CountAspect {
    return {
        name: `api-usage-${api}-count`,
        displayName: `Number of ${api} API usages`,
        extract: async () => [],
        consolidate: async fps => {
            function isApiUsageAspect(o: FP): o is FP<string[]> {
                return (!!o.type && o.type === `api-usage-${api}`);
            }
            const apiUsageAspect = fps.find(isApiUsageAspect);
            if (apiUsageAspect) {
                return fingerprintOf({
                    type: `api-usage-${api}-count`,
                    data: {count: apiUsageAspect.data.length},
                });
            } else {
                return undefined;
            }
        },
    };
}

export const GuavaDeprecationAspects: Aspect[] = [
    Guava19DeprecatedApiAspect,
    Guava20DeprecatedApiAspect,
    Guava21DeprecatedApiAspect,
    Guava22DeprecatedApiAspect,
    Guava23DeprecatedApiAspect,
    Guava19DeprecatedApiCountAspect,
    Guava20DeprecatedApiCountAspect,
    Guava21DeprecatedApiCountAspect,
    Guava22DeprecatedApiCountAspect,
    Guava23DeprecatedApiCountAspect,
];
