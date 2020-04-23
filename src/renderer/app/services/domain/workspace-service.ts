import {Fs} from "@/renderer/app/util/fs";
import * as path from "path";
import {
    deleteFileIfExists,
    deleteDirectory,
    downloadFile,
    ensureDirExists,
    recreateDir,
    unzipFile, moveDirContents
} from "@/renderer/app/util/file-utils";
import {PluginFormat, UserConfig} from "@/renderer/app/model/user-config";
import {OperatingSystem} from "@/renderer/app/services/domain/constants";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";


const getDependenciesDirPath = (projectDir: string) => path.join(projectDir, "dependencies");
const getIPlug2DirPath = (projectDir: string) => path.join(getDependenciesDirPath(projectDir), "iPlug2");

export const setupWorkspace = async (userConfigFilePath: string, config: UserConfig, os: OperatingSystem) => {
    console.log("Setting up workspace ...");
    const workspaceDir = path.dirname(userConfigFilePath);
    const iPlug2Path = await downloadIPlug2FromGithub(workspaceDir, config.iPlug2GitSha);
    await downloadIPlug2DependenciesFromGithub(iPlug2Path, config, os);
};

const downloadIPlug2FromGithub = async (projectDirPath: string, shaRef?: string): Promise<string> => {
    console.log("Downloading iPlug2 from Github ...");
    const iPlug2DirPath = getIPlug2DirPath(projectDirPath);
    const zipFilePath = path.join(iPlug2DirPath, `${shaRef}.zip`);
    const targetDirPath = path.join(iPlug2DirPath, shaRef!);
    const zipFileContentDirPath = path.join(iPlug2DirPath, `iPlug2-${shaRef}`);

    await ensureDirExists(iPlug2DirPath);
    await deleteFileIfExists(zipFilePath);

    await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
    await unzipFile(zipFilePath, iPlug2DirPath);
    await Fs.unlink(zipFilePath);

    await deleteDirectory(targetDirPath);
    await Fs.rename(zipFileContentDirPath, targetDirPath);

    return targetDirPath;
};

const downloadIPlug2DependenciesFromGithub = async (iPlug2DirPath: string, config: UserConfig, os: OperatingSystem): Promise<void> => {
    console.log("Downloading iPlug2 dependencies from Github ...");
    const dependenciesDirPath = path.join(iPlug2DirPath, "Dependencies", "Build");
    await recreateDir(dependenciesDirPath);

    if (os == OperatingSystem.MACOS) {
        await downloadIPlug2DependenciesFile("IPLUG2_DEPS_MAC.zip", dependenciesDirPath);

        if (config.formats.includes(PluginFormat.IOS)) {
            await downloadIPlug2DependenciesFile("IPLUG2_DEPS_IOS.zip", dependenciesDirPath);
        }

        return;
    }

    if (os == OperatingSystem.WINDOWS) {
        await downloadIPlug2DependenciesFile("IPLUG2_DEPS_WIN.zip", dependenciesDirPath);
        return;
    }

    throw new UnsupportedOperationError(`Operating system ${os} is unsupported.`)
};


const downloadIPlug2DependenciesFile = async (fileName: string, targetDirPath: string): Promise<void> => {
    console.log(`Downloading iPlug2 dependencies file "${fileName}" from Github ...`);
    const filePath = path.join(targetDirPath, fileName);
    await downloadFile(`https://github.com/iPlug2/iPlug2/releases/download/setup/${fileName}`, filePath);
    await unzipFile(filePath, targetDirPath);
    await deleteFileIfExists(filePath);

    const zipContentsDirectoryPath = path.join(targetDirPath, fileName.replace(".zip", ""));
    await moveDirContents(zipContentsDirectoryPath, targetDirPath);

    await deleteDirectory(zipContentsDirectoryPath);
};

const downloadVstSdk = async (projectDirPath: string): Promise<string> => {
    console.log("Downloading VST SDK from Steinberg ...");
    const iPlug2DirPath = getIPlug2DirPath(projectDirPath);
    const zipFilePath = path.join(iPlug2DirPath, `${shaRef}.zip`);
    const targetDirPath = path.join(iPlug2DirPath, shaRef!);
    const zipFileContentDirPath = path.join(iPlug2DirPath, `iPlug2-${shaRef}`);

    await ensureDirExists(iPlug2DirPath);
    await deleteFileIfExists(zipFilePath);

    await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
    await unzipFile(zipFilePath, iPlug2DirPath);
    await Fs.unlink(zipFilePath);

    await deleteDirectory(targetDirPath);
    await Fs.rename(zipFileContentDirPath, targetDirPath);

    return targetDirPath;
};
