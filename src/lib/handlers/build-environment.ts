import {Fs} from "@/lib/helpers/fs";
import * as path from "path";
import * as fs from "fs";
import * as gitHttp from 'isomorphic-git/http/node';
import * as git from "isomorphic-git"

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
        await Fs.unlink(dir)
    }
    await Fs.mkdir(dir);
    return dir;
};

export const cloneIPlug2GitRepoFromGithub = async (userConfigFilePath: string, repositorySha?: string): Promise<void> => {
    const projectDirectory = path.dirname(userConfigFilePath);
    const tmpDirPath = await ensureDependenciesDirectoryExists(projectDirectory);
    const iPlugOutputDirectory = await ensureIPlugDependencyDirectoryExists(tmpDirPath);
    await git.clone({ fs, http: gitHttp, dir: iPlugOutputDirectory, url: 'https://github.com/iPlug2/iPlug2.git', ref: repositorySha});
};

