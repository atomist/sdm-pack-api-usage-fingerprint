<p align="center">
  <img src="https://images.atomist.com/sdm/SDM-Logo-Dark.png">
</p>

# @atomist/sdm-pack-api-usage-fingerprint

Extension pack for aspect support for fingerprinting usage of APIs

## Aspect

This pack contains an aspect to add API usage detection to your fingerprinting arsenal.

For example:

```
export const Guava19DeprecatedApiAspect = createApiUsageFingerprintAspect("guava-19-deprecated", Guava19DeprecatedApi);
```

The API definitions are defined in a structure like this:

```
export const Guava19DeprecatedApi: ApiDefinition = {
    methods: [
        ...
    classes: [
        ...
    ],
    annotations: [
        ...
    ],
};
```

Each element in the definition will be a fully qualified signature or classname, i.e. `com.google.common.collect.ImmutableList.addAll(int, java.util.Collection)`. 

The fingerprint produced by the aspect will give you the exact locations of that API being used.

This aspect requires a tool to be present on your SDM's machine, in addition to a working JDK 8 or higher. This
tool can be found [here](https://github.com/atomist/sdm-pack-api-usage-fingerprinting/raw/master/test/aspect/list-used-api.jar). 
You'll need to set the `sdm.aspect.apiusage.scanner.location` variable in your client configuration file or the
`API_USAGE_SCANNER_LOCATION` environment variable to the location of this JAR file.

## Transforms

This pack also contains a way to transform APIs in an existing codebase, for example to remove deprecations.

For example, to remove known and automatically fixable deprecations in Guava 19, you can define a transform like this:

```
export const Guava19DeprecationTransform: CodeTransform = async (p, papi) => {
    const script = `
val transformers = listOf(
    replaceMethodOnSameClass("com.google.common.base.Converter.apply(A)", "convert"),
    replaceMethodOnSameClass("com.google.common.collect.Range.apply(C)", "contains"),
    replaceMethodOnSameClass("com.google.common.base.CharMatcher.apply(Character)", "matches"),
    replaceMethodOnSameClass("com.google.common.cache.LoadingCache.apply(K)", "getUnchecked"),
    replaceMethodOnSameClass("com.google.common.hash.BloomFilter.apply(T)", "mightContain"),
    replaceMethodOnSameClass("com.google.common.collect.ArrayTable.remove(Object, Object)", "erase")
)
ExecuteTransformCommand(transformers).main(args)
    `;
    await (await createRefactoringKotlinScriptTransform(script))(p, papi);
    return p;
};
```

This transforms has 2 requirements to be present on the SDM machine:
- Kotlin
- KotlinScript

Both can be installed with the instructions found [here](https://github.com/holgerbrandl/kscript#installation).

This transform also requires 2 base scripts to be available:
- https://github.com/atomist/sdm-pack-api-usage-fingerprinting/raw/master/test/support/guava/transforms/base.kts
- https://github.com/atomist/sdm-pack-api-usage-fingerprinting/raw/master/test/support/guava/transforms/refactors.kts

You'll need to copy these scripts to a folder and either set the configuration value `sdm.aspect.deprecation.guava.basescript.dir` 
or the environment variable `API_USAGE_TRANSFORM_SCRIPT_DIR` to this folder.





