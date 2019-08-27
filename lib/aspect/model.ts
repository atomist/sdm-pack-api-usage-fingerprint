import { toArray } from "@atomist/sdm-core/lib/util/misc/array";

export interface UsedApis {
    methods: Method[];
    classesOrInterfaces: ClassOrInterface[];
    annotations: Annotation[];
}

export function usesDeprecatedApis(usedApis: UsedApis, deprecatedApis: ApiDeprecation[]): boolean {
    const usesDeprecatedMethods = deprecatedApis.filter(a => a.elementType === "method")
        .some(a => a.matches(usedApis.methods.map(m => m.fqn)));
    const usesDeprecatedClassesOrInterfaces = deprecatedApis.filter(a => a.elementType === "classOrInterface")
        .some(a => a.matches(usedApis.classesOrInterfaces.map(c => c.fqn)));
    const usesDeprecatedAnnotations = deprecatedApis.filter(a => a.elementType === "annotation")
        .some(a => a.matches(usedApis.annotations.map(ann => ann.fqn)));
    return usesDeprecatedMethods || usesDeprecatedAnnotations || usesDeprecatedClassesOrInterfaces;
}

export interface Method {
    fqn: string;
}

export interface ClassOrInterface {
    fqn: string;
}

export interface Annotation {
    fqn: string;
}

export class ApiDeprecation implements ApiDeprecation {
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
