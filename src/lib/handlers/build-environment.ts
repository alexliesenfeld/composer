import {Fs} from "@/lib/helpers/fs";
import * as path from "path";
import {deleteFolderRecursive, downloadFile, unzipFile} from "@/renderer/app/support/util/file-utils";
import * as fs from "fs";

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

export const cloneIPlug2GitRepoFromGithub = async (userConfigFilePath: string, repositorySha: string): Promise<void> => {
    const projectDirectory = path.dirname(userConfigFilePath);
    const tmpDirPath = await ensureDependenciesDirectoryExists(projectDirectory);
    const iPlugOutputDirectory = await ensureIPlugDependencyDirectoryExists(tmpDirPath);
    //await git.clone({ fs, http: gitHttp, dir: iPlugOutputDirectory, url: 'https://github.com/iPlug2/iPlug2.git', ref: repositorySha});
};

export const downloadIPlug2FromGithub = async (userConfigFilePath: string, shaRef?: string): Promise<void> => {
    const projectDirectory = path.dirname(userConfigFilePath);
    const tmpDirPath = await ensureDependenciesDirectoryExists(projectDirectory);
    const outputDir = await ensureIPlugDependencyDirectoryExists(tmpDirPath);

    const targetFile = path.join(outputDir, `${shaRef}.zip`);
    await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, targetFile);
    await unzipFile(targetFile, outputDir);
    await Fs.unlink(targetFile);
    await Fs.rename(path.join(outputDir, `iPlug2-${shaRef}`), path.join(outputDir, shaRef!));
    console.log("DONE");
};


