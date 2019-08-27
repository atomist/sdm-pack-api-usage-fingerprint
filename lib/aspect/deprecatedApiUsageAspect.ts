import { LocalProject } from "@atomist/automation-client";
import {
    Aspect,
    FP,
} from "@atomist/sdm-pack-fingerprints";
import { UsedApis } from "./model";
import { UsedApiExtractor } from "./UsedApiExtractor";

export function createDeprecatedApiUsageAspect(
    api: string,
    fingerprinter: (usedApis: UsedApis) => Array<FP<string>>): Aspect<string> {
    return {
        name: `deprecated-${api.toLowerCase()}-api-usage`,
        displayName: `Used deprecated API versions for ${api}`,
        extract: async (p, pli) => {
            const usedApiExtractor = new UsedApiExtractor();
            const usedApis = await usedApiExtractor.getUsedApis(p as LocalProject, pli);
            return fingerprinter(usedApis);
        },
        apply: async (p, papi) => {
            return p;
        },
        toDisplayableFingerprintName: name => name,
        toDisplayableFingerprint: fp => fp.data,
    };
}
