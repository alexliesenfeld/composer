import {Fs} from "@/renderer/app/util/fs";
import * as path from "path";
import {deleteFolderRecursive, downloadFile, unzipFile} from "@/renderer/app/util/file-utils";
import {activity} from "@/renderer/app/util/activity-util";
import {UserConfig} from "@/renderer/app/model/user-config";
import {errorToast} from "@/renderer/app/util/app-toaster";

export const ensureDirExists = async (dirPath: string): Promise<string> => {
    if (!await Fs.exists(dirPath)) {
        await Fs.mkdir(dirPath, {recursive: true})
    }
    return dirPath;
};

export const recreateDir = async (dependenciesDirectory: string): Promise<string> => {
    if (await Fs.exists(dependenciesDirectory)) {
        await deleteFolderRecursive(dependenciesDirectory)
    }
    await Fs.mkdir(dependenciesDirectory);
    return dependenciesDirectory;
};

const getDependenciesDirPath = (projectDir: string) => {
    return path.join(projectDir, "dependencies");
};


const getIPlug2DirPath = (projectDir: string) => {
    return path.join(getDependenciesDirPath(projectDir), "iPlug2");
};

export class WorkspaceController {

    @activity("Setting up workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig) {
        console.log("Started all");
        await this.downloadIPlug2FromGithub(userConfigFilePath, config.iPlug2GitSha);
        await this.downloadIPlug2FromGithub2(userConfigFilePath, config.iPlug2GitSha);
        console.log("Ended all");
    };

    @activity("Downloading iPlug2 from GitHub")
    private async downloadIPlug2FromGithub(userConfigFilePath: string, shaRef?: string): Promise<void> {
        console.log("Starting 1");
        const projectDir = path.dirname(userConfigFilePath);
        const iPlug2Dir = await ensureDirExists(getIPlug2DirPath(projectDir));

        const targetFile = path.join(iPlug2Dir, `${shaRef}.zip`);
        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, targetFile);
        await unzipFile(targetFile, iPlug2Dir);
        await Fs.unlink(targetFile);

        await Fs.rename(path.join(iPlug2Dir, `iPlug2-${shaRef}`), path.join(iPlug2Dir, shaRef!));
        console.log("Ended 1");
    };

    @activity("XXX Downloading iPlug2 from GitHub 2")
    private async downloadIPlug2FromGithub2(userConfigFilePath: string, shaRef?: string): Promise<void> {
        console.log("Starting 1");
        const projectDir = path.dirname(userConfigFilePath);
        const iPlug2Dir = await ensureDirExists(getIPlug2DirPath(projectDir));

        const targetFile = path.join(iPlug2Dir, `${shaRef}.zip`);
        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, targetFile);
        await unzipFile(targetFile, iPlug2Dir);
        await Fs.unlink(targetFile);

        await Fs.rename(path.join(iPlug2Dir, `iPlug2-${shaRef}`), path.join(iPlug2Dir, shaRef!));
        console.log("Ended 1");
    };
}
