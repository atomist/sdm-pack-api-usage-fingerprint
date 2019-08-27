import {
    ConfigurationValueType,
    ExtensionPack,
    metadata
} from "@atomist/sdm";
import { aspectSupport } from "@atomist/sdm-pack-aspect";

export const deprecatedApiFingerprintSupport: ExtensionPack = {
    ...metadata(),
    requiredConfigurationValues: [
        {
            path: "sdm.aspect.deprecation.scanner.location",
            type: ConfigurationValueType.String,
        },
    ],
    configure: sdm => {
        sdm.addExtensionPacks(
            aspectSupport({
                aspects: [],
            }),
        );
        return sdm;
    },
};
