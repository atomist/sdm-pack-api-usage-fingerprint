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
    CodeTransform,
    spawnLog,
    StringCapturingProgressLog,
} from "@atomist/sdm";
import * as fs from "fs-extra";
import { TmpDir } from "temp-file";

export async function createRefactoringKotlinScriptTransform(script: string): Promise<CodeTransform> {
    return async p => {
        const tempFile = await new TmpDir().getTempFile({prefix: "script", suffix: ".kts"});
        const baseScriptsLocation = configurationValue<string>("sdm.aspect.deprecation.guava.basescript.dir",
            process.env.API_USAGE_TRANSFORM_SCRIPT_DIR);
        const kScript = `#!/usr/bin/env kscript
@file:Include("${baseScriptsLocation}/refactors.kts")
@file:Include("${baseScriptsLocation}/base.kts")
${script}`;
        await fs.writeFile(tempFile, kScript);
        const localProject = p as LocalProject;
        const log = new StringCapturingProgressLog();
        const build = (!!(await p.getFile("pom.xml"))) ? "maven" : "gradle";
        await spawnLog("kscript", [tempFile, `--path=${localProject.baseDir}`, `--build=${build}`], {
            log,
        });
        return p;
    };
}
