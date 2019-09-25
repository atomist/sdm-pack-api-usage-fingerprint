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
