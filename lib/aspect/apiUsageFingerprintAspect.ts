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
    LocalProject,
    Project,
} from "@atomist/automation-client";
import { File } from "@atomist/automation-client/lib/project/File";
import {
    Aspect,
    fingerprintOf,
} from "@atomist/sdm-pack-fingerprint";
import * as path from "path";
import { ApiDefinition } from "./model";
import { UsedApiLocator } from "./UsedApiLocator";

export interface UsedApiFPData {
    api: string;
    versions: string | string[];
}

async function getBuildFiles(p: Project): Promise<File[]> {
    return p.getFiles(["**/build.gradle", "**/pom.xml"]);
}

export function createApiUsageFingerprintAspect(
    api: string,
    apiDefinition: ApiDefinition): Aspect<string[]> {
    return {
        name: `api-usage-${api}`,
        displayName: `Used API versions for ${api}`,
        extract: async (p, pli) => {
            const buildFiles = await getBuildFiles(p);
            if (buildFiles && buildFiles.length > 0) {
                const fps = await Promise.all(buildFiles.map(async bf => {
                    const lastIndex = bf.path.lastIndexOf("/");
                    const directory = lastIndex === -1 ? "" : bf.path.slice(0, bf.path.lastIndexOf("/"));
                    if (await p.hasDirectory(path.join(directory, "src"))) {
                        const usedApiExtractor = new UsedApiLocator(apiDefinition);
                        try {
                            const usedApis = await usedApiExtractor.locateUsedApis(p as LocalProject, directory, pli);
                            return fingerprintOf(
                                {
                                    type: `api-usage-${api}`,
                                    name: `api-usage-${api}:${directory === "" ? "root" : directory}`,
                                    data: usedApis,
                                });
                        } catch (e) {
                            return fingerprintOf(
                                {
                                    type: `api-usage-${api}`,
                                    name: `api-usage-${api}:${directory === "" ? "root" : directory}`,
                                    data: {
                                        error: e,
                                    },
                                });
                        }
                    } else {
                        return fingerprintOf(
                            {
                                type: `api-usage-${api}`,
                                name: `api-usage-${api}:${directory === "" ? "root" : directory}`,
                                data: {
                                    error: "No source folder found",
                                },
                            });
                    }
                }));
                return fps.filter(fp => !!fp);
            } else {
                return undefined;
            }
        },
        toDisplayableFingerprintName: name => name,
        toDisplayableFingerprint: fp => `API usage for ${api}: ${fp.data.length} occurrences`,
    };
}
