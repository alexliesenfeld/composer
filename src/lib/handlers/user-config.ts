import {ExecutionContext} from "@/lib/execution-context";
import {UserConfig} from "@/lib/model/user-config";

export const loadConfigFromPath = async (context: ExecutionContext, path: string): Promise<UserConfig> => {
    const fileContent = await context.promisifiedFs.readFile(path, {encoding: 'utf-8'});
    return JSON.parse(fileContent);
};

export const writeConfigToPath = async (context: ExecutionContext, path: string, config: UserConfig): Promise<unknown> => {
    return context.promisifiedFs.writeFile(path, JSON.stringify(config));
};
