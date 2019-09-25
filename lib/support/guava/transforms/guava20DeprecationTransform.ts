import {
    anySatisfied,
    AutofixRegistration,
    CodeTransform,
} from "@atomist/sdm";
import {
    IsGradle,
    IsMaven,
} from "@atomist/sdm-pack-spring";

export const Guava19DeprecationTransform: CodeTransform = async p => {
    // do the transforms
    return p;
};

export const Guava19DeprecationAutofix: AutofixRegistration = {
    name: "guava-19-deprecation-transform",
    pushTest: anySatisfied(IsMaven, IsGradle),
    transform: Guava19DeprecationTransform,
};
