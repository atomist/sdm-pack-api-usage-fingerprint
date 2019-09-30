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
import {
    readFile,
    writeFile,
} from "fs-extra";
import { TmpDir } from "temp-file";
import { ApiDefinition } from "./model";

async function determineBuildTool(p: LocalProject): Promise<string> {
    if (await p.hasFile("pom.xml")) {
        return "maven";
    } else {
        return "gradle";
    }
}

export class UsedApiLocator {
    private readonly scanToolPath: string;

    constructor(readonly apiDefinition: ApiDefinition) {
        this.scanToolPath = configurationValue<string>("sdm.aspect.apiusage.scanner.location", process.env.API_USAGE_SCANNER_LOCATION);
    }

    public async locateUsedApis(p: LocalProject, pli: PushImpactListenerInvocation): Promise<string[]> {
        return this.getUsedApisForCompleteProject(p);
    }

    private async getUsedApisForCompleteProject(p: LocalProject): Promise<string[]> {
        const log = new StringCapturingProgressLog();
        const apiDefinitionJson = JSON.stringify(this.apiDefinition);
        const buildTool = await determineBuildTool(p);
        const apiDefinitionFile = await writeToTempFile(apiDefinitionJson);
        const outputFile = await getTempOutputFile();
        const result = await spawnLog("java",
            [
                "-jar", this.scanToolPath,
                "--path", p.baseDir,
                "--build", buildTool,
                "--definitions", apiDefinitionFile,
                "--output-file", outputFile,
            ], {
            log,
        });
        if (result.code === 0) {
            const output = await readFile(outputFile, "UTF-8");
            return JSON.parse(output);
        } else {
            return Promise.reject("Could not get API usage results");
        }
    }
}

async function getTempOutputFile(): Promise<string> {
    const tempDir = new TmpDir();
    return tempDir.getTempFile({prefix: "output", suffix: ".json"});
}

async function writeToTempFile(apiDefinitionJson: string): Promise<string> {
    const tempDir = new TmpDir();
    const file = await tempDir.getTempFile({prefix: "api-definition", suffix: ".json"});
    await writeFile(file, apiDefinitionJson);
    return file;
}
