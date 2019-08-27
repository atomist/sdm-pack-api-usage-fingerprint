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
