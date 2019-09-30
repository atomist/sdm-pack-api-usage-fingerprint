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
    NodeFsLocalProject,
} from "@atomist/automation-client";
import { toArray } from "@atomist/sdm-core/lib/util/misc/array";
import * as assert from "power-assert";
import { TmpDir } from "temp-file";
import {
    Guava19DeprecatedApiAspect,
    Guava20DeprecatedApiAspect,
} from "../../lib/support/guava/guavaDeprecatedApiAspects";

describe("API usage fingerprint aspect", () => {
    before("set scanner location", () => {
        process.env.API_USAGE_SCANNER_LOCATION = __dirname + "/list-used-api.jar";
    });

    it("should find Guava 19 usage in code", async () => {
        const tempDir = new TmpDir();
        const project =  new NodeFsLocalProject("testing", await tempDir.getTempDir());
        const pom = `<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atomist</groupId>
  <artifactId>test-example</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>test-example</name>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>19.0</version>
    </dependency>
  </dependencies>
</project>`;
        const javaFile = `package test;

public class App {
    public static void main(String[] args) {
        com.google.common.collect.Range range = com.google.common.collect.Range.all();
        Comparable o = null;
        range.apply(o);
    }
}
`;
        await project.addFile("pom.xml", pom);
        await project.addFile("src/main/java/test/MyTest.java", javaFile);
        const fingerprints = toArray(await Guava19DeprecatedApiAspect.extract(project, undefined));
        assert.strictEqual(fingerprints.length, 1);
        const fingerprint = fingerprints[0];
        assert.strictEqual(fingerprint.data.length, 1);
        assert.strictEqual(fingerprint.data[0], "src/main/java/test/MyTest.java:7");
    }).enableTimeouts(false);

    it("should find Guava 20 usage in code", async () => {
        const tempDir = new TmpDir();
        const project =  new NodeFsLocalProject("testing", await tempDir.getTempDir());
        const pom = `<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atomist</groupId>
  <artifactId>test-example</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>test-example</name>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>20.0</version>
    </dependency>
  </dependencies>
</project>`;
        const javaFile = `package test;

import static com.google.common.base.Objects.toStringHelper;

public class App {
    public static void main(String[] args) {
        toStringHelper(App.class.getName()).add("hello", "world");
    }
}
`;
        await project.addFile("pom.xml", pom);
        await project.addFile("src/main/java/test/MyTest.java", javaFile);
        const fingerprints = toArray(await Guava20DeprecatedApiAspect.extract(project, undefined));
        assert.strictEqual(fingerprints.length, 1);
        const fingerprint = fingerprints[0];
        assert.strictEqual(fingerprint.data.length, 1);
        assert.strictEqual(fingerprint.data[0], "src/main/java/test/MyTest.java:7");
    }).enableTimeouts(false);

    it("should find multiple Guava 20 usage in code", async () => {
        const tempDir = new TmpDir();
        const project =  new NodeFsLocalProject("testing", await tempDir.getTempDir());
        const pom = `<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atomist</groupId>
  <artifactId>test-example</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>test-example</name>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>20.0</version>
    </dependency>
  </dependencies>
</project>`;
        const javaFile = `package test;

import static com.google.common.base.Objects.toStringHelper;

public class App {
    public static void main(String[] args) {
        com.google.common.collect.Range range = com.google.common.collect.Range.all();
        Comparable o = null;
        range.apply(o);
        toStringHelper(App.class.getName()).add("hello", "world");
    }
}
`;
        await project.addFile("pom.xml", pom);
        await project.addFile("src/main/java/test/MyTest.java", javaFile);
        const fingerprints = toArray(await Guava20DeprecatedApiAspect.extract(project, undefined));
        assert.strictEqual(fingerprints.length, 1);
        const fingerprint = fingerprints[0];
        assert.strictEqual(fingerprint.data.length, 2);
        assert(fingerprint.data.indexOf("src/main/java/test/MyTest.java:9") >= 0);
        assert(fingerprint.data.indexOf("src/main/java/test/MyTest.java:10") >= 0);
    }).enableTimeouts(false);
}).enableTimeouts(false);
