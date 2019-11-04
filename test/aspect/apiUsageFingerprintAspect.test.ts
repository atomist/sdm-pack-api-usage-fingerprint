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
import { sha256 } from "@atomist/sdm-pack-fingerprint";
import * as assert from "power-assert";
import { TmpDir } from "temp-file";
import {
    Guava19DeprecatedApiAspect,
    Guava20DeprecatedApiAspect,
} from "../../lib/support/guava/guavaDeprecatedApiAspects";

const trueSha = sha256(JSON.stringify(true));

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
        assert.deepEqual(fingerprint.data[0], {
            directory: "root",
            usedApis: ["src/main/java/test/MyTest.java:7"],
        });
        assert.strictEqual(fingerprint.sha, trueSha);
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
        assert.deepEqual(fingerprint.data[0], {
            directory: "root",
            usedApis: ["src/main/java/test/MyTest.java:7"],
        });
        assert.strictEqual(fingerprint.sha, trueSha);
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
        assert.deepEqual(fingerprint.data[0], {
            directory: "root",
            usedApis: ["src/main/java/test/MyTest.java:9", "src/main/java/test/MyTest.java:10"],
        });
        assert.strictEqual(fingerprint.sha, trueSha);
    }).enableTimeouts(false);

    it("should find Guava 19 usage in maven multi module code", async () => {
        const tempDir = new TmpDir();
        const project =  new NodeFsLocalProject("testing", await tempDir.getTempDir());
        const parentPom = `<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.atomist</groupId>
  <artifactId>test-example-parent</artifactId>
  <version>1.0-SNAPSHOT</version>
  <name>test-example</name>
  <packaging>pom</packaging>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <modules>
    <module>one</module>
    <module>two</module>
  </modules>

  <dependencies>
    <dependency>
      <groupId>com.google.guava</groupId>
      <artifactId>guava</artifactId>
      <version>19.0</version>
    </dependency>
  </dependencies>
</project>`;
        const pomOne = `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
      <groupId>com.atomist</groupId>
      <artifactId>test-example-parent</artifactId>
      <version>1.0-SNAPSHOT</version>
  </parent>
  <artifactId>test-example-one</artifactId>
  <name>test-one</name>
</project>
`;
        const pomTwo = `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
      <groupId>com.atomist</groupId>
      <artifactId>test-example-parent</artifactId>
      <version>1.0-SNAPSHOT</version>
  </parent>
  <artifactId>test-example-two</artifactId>
  <name>test-two</name>
</project>
`;
        const javaFile = `package test;

public class App {
    public static void main(String[] args) {
        com.google.common.collect.Range range = com.google.common.collect.Range.all();
        Comparable o = null;
        range.apply(o);
    }
}
`;
        await project.addFile("pom.xml", parentPom);
        await project.addFile("one/pom.xml", pomOne);
        await project.addFile("two/pom.xml", pomTwo);
        await project.addFile("one/src/main/java/test/MyTest.java", javaFile);
        await project.addFile("two/src/main/java/test/MyTest2.java", javaFile);
        const fingerprints = toArray(await Guava19DeprecatedApiAspect.extract(project, undefined));
        assert.strictEqual(fingerprints.length, 1);
        assert.deepEqual(fingerprints[0].data, [
            {
                directory: "one",
                usedApis: ["src/main/java/test/MyTest.java:7"],
            },
            {
                directory: "two",
                usedApis: ["src/main/java/test/MyTest2.java:7"],
            }]);
        assert.strictEqual(fingerprints[0].sha, trueSha);

    }).enableTimeouts(false);

    it("should find Guava 19 usage in gradle multi module code", async () => {
        const tempDir = new TmpDir();
        const project =  new NodeFsLocalProject("testing", await tempDir.getTempDir());
        const parentGradle = `
subprojects {
    apply plugin: "java"

    repositories {
        jcenter()
    }
}
`;

        const settings = `
include "one"
include "two"
`;

        const childGradle = `
dependencies {
    compile "com.google.guava:guava:19.0"
}
`;
        const javaFile = `package test;

public class App {
    public static void main(String[] args) {
        com.google.common.collect.Range range = com.google.common.collect.Range.all();
        Comparable o = null;
        range.apply(o);
    }
}
`;
        await project.addFile("build.gradle", parentGradle);
        await project.addFile("settings.gradle", settings);
        await project.addFile("one/build.gradle", childGradle);
        await project.addFile("two/build.gradle", childGradle);
        await project.addFile("one/src/main/java/test/MyTest.java", javaFile);
        await project.addFile("two/src/main/java/test/MyTest2.java", javaFile);
        const fingerprints = toArray(await Guava19DeprecatedApiAspect.extract(project, undefined));
        assert.deepEqual(fingerprints[0].data, [
            {
                directory: "one",
                usedApis: ["src/main/java/test/MyTest.java:7"],
            },
            {
                directory: "two",
                usedApis: ["src/main/java/test/MyTest2.java:7"],
            }]);
        assert.strictEqual(fingerprints[0].sha, trueSha);
    }).enableTimeouts(false);
}).enableTimeouts(false);
