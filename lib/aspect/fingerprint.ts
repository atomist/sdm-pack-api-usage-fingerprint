import {
    FP,
    sha256,
} from "@atomist/sdm-pack-fingerprints";

const deprecatedApiUsage = "deprecated-api-usage";

export function createDeprecatedApiFingerprint(api: string, version: string): FP<{api: string, version: string}> {
    return {
        data: { api: api.toLowerCase(), version },
        type: deprecatedApiUsage,
        version: "0.1.0",
        name: `deprecated-api-usage:${api}:${version}`,
        sha: sha256(JSON.stringify(version)),
    };
}
