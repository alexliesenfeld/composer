import {Fs} from "@/renderer/app/util/fs";
import * as path from "path";
import {
    deleteFileIfExists,
    deleteFolderRecursive,
    downloadFile,
    ensureDirExists,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {UserConfig} from "@/renderer/app/model/user-config";


export const setupWorkspace = async (userConfigFilePath: string, config: UserConfig) => {
    await downloadIPlug2FromGithub(userConfigFilePath, config.iPlug2GitSha);
};

const downloadIPlug2FromGithub = async (userConfigFilePath: string, shaRef?: string): Promise<void> => {
    const projectDirPath = path.dirname(userConfigFilePath);
    const iPlug2DirPath = getIPlug2DirPath(projectDirPath);
    const zipFilePath = path.join(iPlug2DirPath, `${shaRef}.zip`);
    const targetDirPath = path.join(iPlug2DirPath, shaRef!);
    const zipFileContentDirPath = path.join(iPlug2DirPath, `iPlug2-${shaRef}`);

    await ensureDirExists(iPlug2DirPath);
    await deleteFileIfExists(zipFilePath);

    await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
    await unzipFile(zipFilePath, iPlug2DirPath);
    await Fs.unlink(zipFilePath);

    await deleteFolderRecursive(targetDirPath);
    await Fs.rename(zipFileContentDirPath, targetDirPath);
};

const getDependenciesDirPath = (projectDir: string) => {
    return path.join(projectDir, "dependencies");
};

const getIPlug2DirPath = (projectDir: string) => {
    return path.join(getDependenciesDirPath(projectDir), "iPlug2");
};
