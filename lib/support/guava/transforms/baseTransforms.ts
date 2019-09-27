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
        const baseScriptsLocation = configurationValue<string>("sdm.aspect.deprecation.guava.basescript.dir");
        const kScript = `#!/usr/bin/env kscript
@file:Include("${baseScriptsLocation}/refactors.kts")
${script}`;
        await fs.writeFile(tempFile, kScript);
        const localProject = p as LocalProject;
        const log = new StringCapturingProgressLog();
        await spawnLog("kscript", [tempFile, "--path", localProject.baseDir], {
            log,
        });
        return p;
    };
}
