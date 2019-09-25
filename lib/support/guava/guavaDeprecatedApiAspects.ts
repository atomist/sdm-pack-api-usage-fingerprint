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
