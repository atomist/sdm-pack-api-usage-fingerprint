import {
    configurationValue,
    LocalProject,
} from "@atomist/automation-client";
import {
    PushImpactListenerInvocation,
    spawnLog,
    StringCapturingProgressLog,
} from "@atomist/sdm";
import { UsedApis } from "./model";

export class UsedApiExtractor {
    private readonly scanToolPath: string;

    constructor() {
        this.scanToolPath = configurationValue<string>("sdm.aspect.deprecation.scanner.location");
    }

    public async getUsedApis(p: LocalProject, pli: PushImpactListenerInvocation): Promise<UsedApis> {
        return this.getUsedApisForCompleteProject(p);
    }

    private async getUsedApisForCompleteProject(p: LocalProject): Promise<UsedApis> {
        const log = new StringCapturingProgressLog();
        const result = await spawnLog("java", ["-jar", this.scanToolPath, "-s", p.baseDir], {
            log,
        });
        if (result.code === 0) {
           const output = log.log;
           const parsed = JSON.parse(output);
           return {
               methods: parsed.methods.map(m => ({ fqn: m})),
               annotations: parsed.annotations.map(m => ({ fqn: m})),
               classesOrInterfaces: parsed.classes.map(m => ({ fqn: m})),
           };
        } else {
            return Promise.reject("Could not get API usage results");
        }
    }
}
