import {Fs} from "@/lib/helpers/fs";
import * as path from "path";
import {deleteFolderRecursive, downloadFile, unzipFile} from "@/renderer/app/support/util/file-utils";

export const ensureDependenciesDirectoryExists = async (baseDirectory: string) => {
    const dir = path.join(baseDirectory, "dependencies");
    if (!await Fs.exists(dir)) {
        await Fs.mkdir(dir)
    }
    return dir;
};

export const ensureIPlugDependencyDirectoryExists = async (dependenciesDirectory: string) => {
    const dir = path.join(dependenciesDirectory, "iPlug2");
    if (await Fs.exists(dir)) {
        await deleteFolderRecursive(dir)
    }
    await Fs.mkdir(dir);
    return dir;
};

export const cloneIPlug2GitRepoFromGithub = async (userConfigFilePath: string, repositorySha?: string): Promise<void> => {
    const projectDirectory = path.dirname(userConfigFilePath);
    const tmpDirPath = await ensureDependenciesDirectoryExists(projectDirectory);
    const iPlugOutputDirectory = await ensureIPlugDependencyDirectoryExists(tmpDirPath);
    //await git.clone({ fs, http: gitHttp, dir: iPlugOutputDirectory, url: 'https://github.com/iPlug2/iPlug2.git', ref: repositorySha});
};

export const downloadIPlug2FromGithub = async (userConfigFilePath: string, repositorySha?: string): Promise<void> => {
    const projectDirectory = path.dirname(userConfigFilePath);
    const tmpDirPath = await ensureDependenciesDirectoryExists(projectDirectory);
    const iPlugOutputDirectory = await ensureIPlugDependencyDirectoryExists(tmpDirPath);

    const targetFile = path.join(iPlugOutputDirectory, `iPlug2${repositorySha ? repositorySha : ""}.zip`);
    await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${repositorySha}.zip`, targetFile);

    await unzipFile(targetFile, iPlugOutputDirectory);
};


