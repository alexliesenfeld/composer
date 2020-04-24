import {Fsx} from "@/renderer/app/util/fsx";
import * as path from "path";
import {
    deleteDirectory,
    deleteFileIfExists,
    downloadFile,
    moveDirContents,
    recreateDir,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {PluginFormat, UserConfig} from "@/renderer/app/model/user-config";
import {OperatingSystem} from "@/renderer/app/services/domain/constants";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";
import {activity} from "@/renderer/app/services/ui/activity-util";
import * as git from "@/renderer/app/util/git-utils";
import {Cpx} from "@/renderer/app/util/cpx";

const getDependenciesDirPath = (workspaceDir: string) => path.join(workspaceDir, "dependencies");
const getIPlug2BaseDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "iPlug2");
const getVst3SdkDirPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "IPlug", "VST3_SDK");
const getDownloadsDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "downloads");
const getIPlug2DependenciesPath = (workspaceDir: string) => path.join(getIPlug2BaseDirPath(workspaceDir), "Dependencies");

export class WorkspaceService {

    @activity("Setting up workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig, os: OperatingSystem) {
        const workspaceDir = path.dirname(userConfigFilePath);
        await recreateDir(getDependenciesDirPath(workspaceDir));

        await this.downloadIPlug2FromGithub(workspaceDir, config.iPlug2GitSha);
        await this.downloadIPlug2DependenciesFromGithub(workspaceDir, config, os);
        await this.downloadVstSdk(workspaceDir, "0908f47");
        this.startProject(workspaceDir, config, OperatingSystem.WINDOWS);
    }

    @activity("Downloading iPlug2")
    async downloadIPlug2FromGithub(workspaceDirPath: string, shaRef?: string): Promise<void> {
        const downloadsDirPath = getDownloadsDirPath(workspaceDirPath);
        const zipFilePath = path.join(downloadsDirPath, `${shaRef}.zip`);
        const zipFileContentDirPath = path.join(downloadsDirPath, `iPlug2-${shaRef}`);
        const iPlug2Path = getIPlug2BaseDirPath(workspaceDirPath);

        await recreateDir(downloadsDirPath);

        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
        await unzipFile(zipFilePath, downloadsDirPath);

        await Fsx.unlink(zipFilePath);
        await deleteDirectory(iPlug2Path);

        await Fsx.rename(zipFileContentDirPath, iPlug2Path);
        await deleteDirectory(downloadsDirPath);
    }

    @activity("Downloading iPlug2 dependencies")
    async downloadIPlug2DependenciesFromGithub(workspaceDirPath: string, config: UserConfig, os: OperatingSystem): Promise<void> {
        const dependenciesBuildDirPath = path.join(getIPlug2DependenciesPath(workspaceDirPath), "Build");
        await recreateDir(dependenciesBuildDirPath);

        if (os == OperatingSystem.MACOS) {
            await this.downloadIPlug2DependenciesFile("IPLUG2_DEPS_MAC.zip", dependenciesBuildDirPath);

            if (config.formats.includes(PluginFormat.IOS)) {
                await this.downloadIPlug2DependenciesFile("IPLUG2_DEPS_IOS.zip", dependenciesBuildDirPath);
            }

            return;
        }

        if (os == OperatingSystem.WINDOWS) {
            await this.downloadIPlug2DependenciesFile("IPLUG2_DEPS_WIN.zip", dependenciesBuildDirPath);
            return;
        }

        throw new UnsupportedOperationError(`Operating system ${os} is unsupported.`)
    }

    async downloadIPlug2DependenciesFile(fileName: string, targetDirPath: string): Promise<void> {
        const filePath = path.join(targetDirPath, fileName);
        await downloadFile(`https://github.com/iPlug2/iPlug2/releases/download/setup/${fileName}`, filePath);
        await unzipFile(filePath, targetDirPath);
        await deleteFileIfExists(filePath);

        const zipContentsDirectoryPath = path.join(targetDirPath, fileName.replace(".zip", ""));
        await moveDirContents(zipContentsDirectoryPath, targetDirPath);

        await deleteDirectory(zipContentsDirectoryPath);
    }

    @activity("Downloading VST3 SDK")
    async downloadVstSdk(woorkspaceDir: string, sha1: string) {
        const targetDir = getVst3SdkDirPath(woorkspaceDir);
        await recreateDir(targetDir);

        await git.cloneRepo("git clone https://github.com/steinbergmedia/vst3sdk.git", sha1, targetDir);
        await git.initSubmodule("pluginterfaces", targetDir);
        await git.initSubmodule("base", targetDir);
        await git.initSubmodule("public.sdk", targetDir);
        await git.initSubmodule("doc", targetDir);
    }

    @activity("Starting IDE project")
    async startProject(workspaceDirPath: string, config: UserConfig, os: OperatingSystem): Promise<void> {
        const p = path.join(workspaceDirPath, "dependencies", "iPlug2", "Examples", "IPlugEffect", "IPlugEffect.sln");
        await Cpx.sudoExec(`start ${p}`);
    }
}
