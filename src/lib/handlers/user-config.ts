import {UserConfig} from "@/lib/model/user-config";
import {Fs} from "@/lib/helpers/fs";
import * as path from "path";
import {DirectoryNotEmptyError} from "@/lib/model/errors";

export const loadConfigFromPath = async (path: string): Promise<UserConfig> => {
    const fileContent = await Fs.readFile(path, {encoding: 'utf-8'});
    return JSON.parse(fileContent);
};

export const writeConfigToPath = async (path: string, config: UserConfig): Promise<unknown> => {
    return Fs.writeFile(path, JSON.stringify(config));
};

export const writeNewConfigToPath = async (filePath: string, config: UserConfig): Promise<unknown> => {
    const directoryPath = path.dirname(filePath);
    const filesInDirectory = await Fs.readdir(directoryPath);

    if (filesInDirectory && filesInDirectory.length > 0) {
        throw new DirectoryNotEmptyError("The directory of a new project must be empty.", directoryPath)
    }

    return writeConfigToPath(filePath, config);
};
