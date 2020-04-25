import {Fsx} from "@/renderer/app/util/fsx";
import * as path from "path";
import {
    createDirIfNotExists,
    deleteDirectory,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty,
    downloadFile,
    moveDir,
    moveDirContents,
    recreateDir,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {PluginFormat, UserConfig} from "@/renderer/app/model/user-config";
import {OperatingSystem} from "@/renderer/app/services/domain/constants";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";
import * as git from "@/renderer/app/util/git-utils";
import {Cpx} from "@/renderer/app/util/cpx";
import {log, logActivity} from "@/renderer/app/services/ui/logging-service";

const getDependenciesDirPath = (workspaceDir: string) => path.join(workspaceDir, "lib");
const getIPlug2BaseDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "iPlug2");
const getVst3SdkDirPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "IPlug", "VST3_SDK");
const getWorkDirPath = (workspaceDir: string) => path.join(workspaceDir, ".work");
const getIPlug2DependenciesPath = (workspaceDir: string) => path.join(getIPlug2BaseDirPath(workspaceDir), "Dependencies");
const getIPlug2DependenciesBuildPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "Build");
const getProjectSourcesPath = (workspaceDir: string) => path.join(workspaceDir, "src");

export class WorkspaceService {

    @logActivity("Starting IDE")
    async startIDE(userConfigFilePath: string, config: UserConfig, os: OperatingSystem) {
        const workspaceDir = path.dirname(userConfigFilePath);
        await createDirIfNotExists(getDependenciesDirPath(workspaceDir));

        if (await this.shouldSetupIPlug2(workspaceDir)) {
            await this.downloadIPlug2FromGithub(workspaceDir, config.iPlug2GitSha);
        }

        if (await this.shouldSetupIPlug2Dependencies(workspaceDir)) {
            await this.downloadIPlug2DependenciesFromGithub(workspaceDir, config, os);
        }

        if (await this.shouldSetupVst3Sdk(workspaceDir)) {
            await this.downloadVstSdk(workspaceDir, "0908f47");
        }

        if (await this.shouldSetupProject(workspaceDir)) {
            await this.createProjectSources(workspaceDir, config);
        }

        if(os === OperatingSystem.WINDOWS) {
            await this.startVisualStudioProject(workspaceDir, config, OperatingSystem.WINDOWS);
        } else {
            throw new UnsupportedOperationError("OS other than Windows are currently not supported");
        }

    }

    @logActivity("Cloning iPlug2 Git repo")
    async downloadIPlug2FromGithub(workspaceDirPath: string, shaRef?: string): Promise<void> {
        const workDirPath = getWorkDirPath(workspaceDirPath);
        const zipFilePath = path.join(workDirPath, `${shaRef}.zip`);
        const zipFileContentDirPath = path.join(workDirPath, `iPlug2-${shaRef}`);
        const iPlug2Path = getIPlug2BaseDirPath(workspaceDirPath);

        await recreateDir(workDirPath);

        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
        await unzipFile(zipFilePath, workDirPath);

        await Fsx.unlink(zipFilePath);
        await deleteDirectory(iPlug2Path);

        await Fsx.rename(zipFileContentDirPath, iPlug2Path);
        await deleteDirectory(workDirPath);
    }

    @logActivity("Downloading iPlug2 prebuilt dependencies")
    async downloadIPlug2DependenciesFromGithub(workspaceDirPath: string, config: UserConfig, os: OperatingSystem): Promise<void> {
        const dependenciesBuildDirPath = getIPlug2DependenciesBuildPath(workspaceDirPath);
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

    @logActivity("Cloning VST3 SDK Git repo")
    async downloadVstSdk(woorkspaceDir: string, sha1: string) {
        const targetDir = getVst3SdkDirPath(woorkspaceDir);
        await recreateDir(targetDir);

        await git.cloneRepo("git clone https://github.com/steinbergmedia/vst3sdk.git", sha1, targetDir);
        await git.initSubmodule("pluginterfaces", targetDir);
        await git.initSubmodule("base", targetDir);
        await git.initSubmodule("public.sdk", targetDir);
        await git.initSubmodule("doc", targetDir);
    }

    @logActivity("Starting Visual Studio project")
    async startVisualStudioProject(workspaceDirPath: string, config: UserConfig, os: OperatingSystem): Promise<void> {
        const vsSolutionPath = path.join(workspaceDirPath, "src", config.projectName + ".sln");
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    @logActivity("Creating project from iPlug2 prototype")
    async createProjectSources(workspaceDirPath: string, config: UserConfig): Promise<void> {
        const sourcesPath = getProjectSourcesPath(workspaceDirPath);
        const examplesPath = path.join(getIPlug2BaseDirPath(workspaceDirPath), "Examples");
        const workDirPath = getWorkDirPath(workspaceDirPath);

        await recreateDir(workDirPath);

        await Cpx.spawn(`python duplicate.py ${config.prototype} ${config.projectName} ${config.manufacturerName} ${workDirPath}`, examplesPath);

        await deleteDirectory(sourcesPath);
        await moveDir(path.join(workDirPath, config.projectName), sourcesPath);

        await deleteDirectory(workDirPath);
    }


    async shouldSetupIPlug2(workspaceDirPath: string): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(getIPlug2BaseDirPath(workspaceDirPath));
    }

    async shouldSetupIPlug2Dependencies(workspaceDirPath: string): Promise<boolean> {
        return await directoryDoesNotExistOrIsEmpty(getIPlug2DependenciesBuildPath(workspaceDirPath));
    }

    async shouldSetupVst3Sdk(workspaceDirPath: string): Promise<boolean> {
        return await directoryDoesNotExistOrIsEmpty(getVst3SdkDirPath(workspaceDirPath), ["README.md"]);
    }

    async shouldSetupProject(workspaceDirPath: string): Promise<boolean> {
        return await directoryDoesNotExistOrIsEmpty(getProjectSourcesPath(workspaceDirPath));
    }
}
