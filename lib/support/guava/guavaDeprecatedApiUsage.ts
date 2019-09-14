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
    GraphClientFactory,
    LocalProject,
} from "@atomist/automation-client";
import {
    CodeTransform,
    spawnLog,
    StringCapturingProgressLog,
} from "@atomist/sdm";
import { toArray } from "@atomist/sdm-core/lib/util/misc/array";
import {
    Aspect,
    FP,
} from "@atomist/sdm-pack-fingerprints";
import * as fs from "fs-extra";
import * as _ from "lodash";
import { TmpDir } from "temp-file";
import {
    createApiUsageFingerprintAspect,
    UsedApiFPData,
} from "../../aspect/apiUsageFingerprintAspect";
import {
    createApiUsageFingerprint,
    createApiUsageListFingerprint,
} from "../../aspect/fingerprint";
import { UsedApis } from "../../aspect/model";
import { GetFpByCommitSha } from "../../typings/types";

export function usesDeprecatedApis(usedApis: UsedApis, deprecatedApis: ApiDeprecation[]): boolean {
    const usesDeprecatedMethods = deprecatedApis.filter(a => a.elementType === "method")
        .some(a => a.matches(usedApis.methods.map(m => m.fqn)));
    const usesDeprecatedClassesOrInterfaces = deprecatedApis.filter(a => a.elementType === "classOrInterface")
        .some(a => a.matches(usedApis.classesOrInterfaces.map(c => c.fqn)));
    const usesDeprecatedAnnotations = deprecatedApis.filter(a => a.elementType === "annotation")
        .some(a => a.matches(usedApis.annotations.map(ann => ann.fqn)));
    return usesDeprecatedMethods || usesDeprecatedAnnotations || usesDeprecatedClassesOrInterfaces;
}

export class ApiDeprecation {
    constructor(args: {
        elementType: "classOrInterface" | "method" | "annotation",
        elementFQN: string,
        canBeAutofixed: boolean,
    }) {
        this.elementType = args.elementType;
        this.elementFQN = args.elementFQN;
        this.canBeAutofixed = args.canBeAutofixed;
    }

    public readonly elementType: "classOrInterface" | "method" | "annotation";
    public readonly elementFQN: string;
    public readonly canBeAutofixed: boolean;

    public matches(elements: string | string[]): boolean {
        return toArray(elements).some(e => e === this.elementFQN);
    }
}

export interface HasScript {
    script: string;
}

export class ApiDeprecationWithKScript extends ApiDeprecation implements HasScript {
    public readonly script: string;

    constructor(args: {
        elementType: "classOrInterface" | "method" | "annotation";
        elementFQN: string;
        script: string;
    }) {
        super({canBeAutofixed: true, ...args});
        this.script = args.script;
    }
}

async function createRefactoringKotlinScriptTransform(script: string): Promise<CodeTransform> {
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

const Guava19DeprecatedAPI: ApiDeprecation[] = [
    new ApiDeprecation({
        elementFQN: "com.google.common.util.concurrent.FutureFallback",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.io.InputSupplier",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.io.OutputSupplier",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.MapConstraint",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.MapConstraints",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.base.Objects.ToStringHelper",
        elementType: "classOrInterface",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.ImmutableCollection.add(E)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.UnmodifiableListIterator.add(E)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.ImmutableMultiset.add(E, int)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.ImmutableList.add(int, E)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.ImmutableCollection.addAll(Collection)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecation({
        elementFQN: "com.google.common.collect.ImmutableList.addAll(int, Collection)",
        elementType: "method",
        canBeAutofixed: false,
    }),
    new ApiDeprecationWithKScript({
        elementFQN: "com.google.common.base.Converter.apply(A)",
        elementType: "method",
        script: `val transformer = replaceMethodOnSameClass("com.google.common.base.Converter.apply(A)", "convert")
ExecuteTransformCommand(transformer).main(args)`,
    }),
    new ApiDeprecationWithKScript({
        elementFQN: "com.google.common.collect.Range.apply(C)",
        elementType: "method",
        script: `val transformer = replaceMethodOnSameClass("com.google.common.collect.Range.apply(C)", "contains")
ExecuteTransformCommand(transformer).main(args)`,
    }),
    new ApiDeprecationWithKScript({
        elementFQN: "com.google.common.base.CharMatcher.apply(Character)",
        elementType: "method",
        script: `val transformer = replaceMethodOnSameClass("com.google.common.base.CharMatcher.apply(Character)", "matches")
ExecuteTransformCommand(transformer).main(args)`,
    }),
];

const Guava20DeprecatedAPI: ApiDeprecation[] = [];

const Guava21DeprecatedAPI: ApiDeprecation[] = [];

const Guava22DeprecatedAPI: ApiDeprecation[] = [];

async function createDeprecationTransforms(deprecations: ApiDeprecation[]): Promise<CodeTransform[]>  {
    const transforms = deprecations
        .filter(api => !!(api as any).script )
        .map(async api => createRefactoringKotlinScriptTransform((api as any).script));
    return Promise.all(transforms);
}

async function getGuavaMigrationTransforms(from: string, to: string): Promise<CodeTransform[]> {
    const transforms: CodeTransform[] = [];
    return transforms;
}

async function getOldestApiVersion(workspace: string, sha: string): Promise<string> {
    const graphClient = configurationValue<GraphClientFactory>("graphql.client.factory").create(workspace, {});
    const result = await graphClient.query<GetFpByCommitSha.Query, GetFpByCommitSha.Variables>({
        name: "GetFpByCommitSha",
        variables: {
            name: "api-usage:guava",
            sha,
        },
    });
    const fpData = _.first(_.flatten(result.Commit.map(c => c.analysis.map(a => a.data))).map(d => JSON.parse(d)));
    const versions = fpData.versions as string[];
    return _.first(versions.sort());
}

const createGuavaMigrationTransform: CodeTransform<{fp: FP<UsedApiFPData>}> = async (p, papi) => {
    const requestedTargetVersion = papi.parameters.fp.version;
    const currentOldestApiVersion = await getOldestApiVersion(papi.context.workspaceId, papi.push.commit.sha);
    const transforms = getGuavaMigrationTransforms(currentOldestApiVersion, requestedTargetVersion);
    await Promise.all((await transforms).map(async t => t(p, papi)));
    return p;
};

export const GuavaDeprecatedApiUsage: Aspect<UsedApiFPData> = createApiUsageFingerprintAspect("Guava",
    toGuavaDeprecationFingerprint, createGuavaMigrationTransform);

function toGuavaDeprecationFingerprint(usedApis: UsedApis): FP<UsedApiFPData> {
    const versions = getGuavaDeprecationMatchResults(usedApis);
    return createApiUsageListFingerprint("guava", versions);
}

function getGuavaDeprecationMatchResults(usedApis: UsedApis): string[] {
    const matchedVersions = [];
    if (usesDeprecatedApis(usedApis, Guava19DeprecatedAPI)) {
        matchedVersions.push("19");
    }
    if (usesDeprecatedApis(usedApis, Guava20DeprecatedAPI)) {
        matchedVersions.push("20");
    }
    if (usesDeprecatedApis(usedApis, Guava21DeprecatedAPI)) {
        matchedVersions.push("21");
    }
    if (usesDeprecatedApis(usedApis, Guava22DeprecatedAPI)) {
        matchedVersions.push("22");
    }
    return matchedVersions;
}
