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

import { ApiDefinition } from "../../aspect/model";

export const Guava19DeprecatedApi: ApiDefinition = {
    methods: [
        "com.google.common.collect.UnmodifiableListIterator.add(E)",
        "com.google.common.collect.ImmutableList.add(int, E)",
        "com.google.common.collect.ImmutableList.addAll(int, Collection)",
        "com.google.common.collect.Range.apply(C)",
        "com.google.common.cache.LoadingCache.apply(K)",
        "com.google.common.collect.ContiguousSet.builder()",
        "com.google.common.collect.ImmutableCollection.clear()",
        "com.google.common.collect.ImmutableMultimap.clear()",
        "com.google.common.collect.ComparisonChain.compare(Boolean, Boolean)",
        "com.google.common.base.Objects.firstNonNull(T, T)",
        "com.google.common.collect.FluentIterable.from(FluentIterable)",
        "com.google.common.util.concurrent.Futures.get(Future, Class)",
        "com.google.common.hash.Hasher.hashCode()",
        "com.google.common.reflect.TypeToken.isAssignableFrom(TypeToken)",
        "com.google.common.collect.ImmutableSortedMap.Builder.orderEntriesByValue(Comparator)",
        "com.google.common.collect.ImmutableSortedSet.pollFirst()",
        "com.google.common.collect.ImmutableSortedMap.pollFirstEntry()",
        "com.google.common.collect.ImmutableSortedMultiset.pollLastEntry()",
        "com.google.common.collect.ImmutableMap.put(K, V)",
        "com.google.common.collect.ImmutableTable.put(R, C, V)",
        "com.google.common.collect.ImmutableMap.putAll(Map)",
        "com.google.common.collect.ImmutableTable.putAll(Table)",
        "com.google.common.collect.UnmodifiableIterator.remove()",
        "com.google.common.collect.ImmutableMap.remove(Object)",
        "com.google.common.collect.ImmutableMultiset.remove(Object, int)",
        "com.google.common.collect.ImmutableMultimap.remove(Object, Object)",
        "com.google.common.collect.ImmutableCollection.removeAll(Collection)",
        "com.google.common.collect.ImmutableMultimap.removeAll(Object)",
        "com.google.common.collect.ImmutableSetMultimap.replaceValues(K, Iterable)",
        "com.google.common.collect.ImmutableListMultimap.replaceValues(K, Iterable)",
        "com.google.common.util.concurrent.MoreExecutors.sameThreadExecutor()",
        "com.google.common.collect.ImmutableList.set(int, E)",
        "com.google.common.collect.ImmutableMultiset.setCount(E, int, int)",
        "com.google.common.base.Objects.toStringHelper(Object)",
        "com.google.common.util.concurrent.Futures.transform(ListenableFuture, AsyncFunction)",
        "com.google.common.collect.Iterables.unmodifiableIterable(ImmutableCollection)",
        "com.google.common.collect.Multimaps.unmodifiableListMultimap(ImmutableListMultimap)",
        "com.google.common.collect.Multisets.unmodifiableMultiset(ImmutableMultiset)",
        "com.google.common.util.concurrent.Futures.withFallback(ListenableFuture, FutureFallback)",
        "com.google.common.io.LittleEndianDataOutputStream.writeBytes(String)"],
    classes: [
        "com.google.common.util.concurrent.FutureFallback",
        "com.google.common.io.InputSupplier",
        "com.google.common.collect.MapConstraint",
        "com.google.common.io.OutputSupplier",
        "com.google.common.collect.MapConstraints",
        "com.google.common.base.Objects.ToStringHelper",
    ],
    annotations: [],
};

export const Guava20DeprecatedApi: ApiDefinition = {
    methods: [],
    classes: [],
    annotations: [],
};

export const Guava21DeprecatedApi: ApiDefinition = {
    methods: [],
    classes: [],
    annotations: [],
};

export const Guava22DeprecatedApi: ApiDefinition = {
    methods: [],
    classes: [],
    annotations: [],
};

export const Guava23DeprecatedApi: ApiDefinition = {
    methods: [],
    classes: [],
    annotations: [],
};
