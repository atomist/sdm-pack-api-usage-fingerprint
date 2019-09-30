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
    Project,
} from "@atomist/automation-client";
import * as assert from "power-assert";
import { TmpDir } from "temp-file";
import { Guava19DeprecationTransform } from "../../../../lib/support/guava/transforms/guava19DeprecationTransform";

xdescribe("Guava deprecation transforms", async () => {
    before("set scanner location", () => {
        process.env.API_USAGE_TRANSFORM_SCRIPT_DIR = __dirname;
    });

    it("should replace the methods", async () => {
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
        const transformReturn = await Guava19DeprecationTransform(project, undefined, undefined) as Project;
        const newContents = await (await transformReturn.getFile("src/main/java/test/MyTest.java")).getContent();
        assert.strictEqual(newContents.indexOf("range.apply(o)"), -1);
        assert(newContents.indexOf("range.contains(o)") >= 0);
    }).enableTimeouts(false);
});
