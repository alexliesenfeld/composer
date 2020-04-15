import {UserConfig} from "@/lib/model/user-config";
import {Fs} from "@/lib/helpers/fs";

export const loadConfigFromPath = async (path: string): Promise<UserConfig> => {
    const fileContent = await Fs.readFile(path, {encoding: 'utf-8'});
    return JSON.parse(fileContent);
};

export const writeConfigToPath = async (path: string, config: UserConfig): Promise<unknown> => {
    return Fs.writeFile(path, JSON.stringify(config));
};
