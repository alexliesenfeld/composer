import {
    createDirIfNotExists,
    deleteDirectory,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty,
    downloadFile,
    moveDirContents,
    recreateDir,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {
    getDependenciesDirPath,
    getIPlug2BaseDirPath,
    getIPlug2DependenciesBuildPath,
    getProjectBuildPath,
    getVst3SdkDirPath,
    getWorkDirPath,
    getWorkspaceDir
} from "@/renderer/app/services/domain/common";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import * as path from "path";
import {Fsx} from "@/renderer/app/util/fsx";
import * as git from "@/renderer/app/util/git-utils";
import {Cpx} from "@/renderer/app/util/cpx";

export abstract class AbstractWorkspaceService {

    protected constructor(protected filesService: FilesService) {
    }

    @logActivity("Starting IDE")
    public async startIDE(userConfigFilePath: string, config: WorkspaceConfig) {
        const workspaceDir = getWorkspaceDir(userConfigFilePath);
        await createDirIfNotExists(getDependenciesDirPath(workspaceDir));

        if (await this.shouldSetupIPlug2(workspaceDir)) {
            await this.downloadIPlug2FromGithub(workspaceDir, config.iPlug2GitSha);
        }

        if (await this.shouldSetupIPlug2Dependencies(workspaceDir)) {
            await this.downloadIPlug2DependenciesFromGithub(workspaceDir);
        }

        if (await this.shouldSetupVst3Sdk(workspaceDir)) {
            await this.downloadVstSdk(workspaceDir, "0908f47");
        }

        await this.createProjectSources(userConfigFilePath, config);
        await this.startIDEProject(workspaceDir, config);
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
    async downloadIPlug2DependenciesFromGithub(workspaceDirPath: string): Promise<void> {
        const dependenciesBuildDirPath = getIPlug2DependenciesBuildPath(workspaceDirPath);
        await recreateDir(dependenciesBuildDirPath);

        const dependencyFiles = await this.getIPlug2DependencyFileNames();
        for (const file of dependencyFiles) {
            await this.downloadIPlug2DependenciesFile(file, dependenciesBuildDirPath);
        }
    }

    @logActivity("Downloading iPlug2 prebuilt dependency file #{0}")
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

    @logActivity("Creating project from iPlug2 prototype")
    async createProjectSources(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const workspaceDirPath = getWorkspaceDir(composerFilePath);
        const buildPath = getProjectBuildPath(workspaceDirPath);
        const examplesPath = path.join(getIPlug2BaseDirPath(workspaceDirPath), "Examples");

        await recreateDir(buildPath);
        await Cpx.spawn(`python duplicate.py ${config.prototype} ${config.projectName} ${config.manufacturerName} ${buildPath}`, examplesPath);

        await this.addSourceFilesToIDEProject(composerFilePath, config);
    }

    async shouldSetupIPlug2(workspaceDirPath: string): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(getIPlug2BaseDirPath(workspaceDirPath));
    }

    async shouldSetupIPlug2Dependencies(workspaceDirPath: string): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(getIPlug2DependenciesBuildPath(workspaceDirPath));
    }

    async shouldSetupVst3Sdk(workspaceDirPath: string): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(getVst3SdkDirPath(workspaceDirPath), ["README.md"]);
    }

    abstract async addSourceFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void>;

    abstract async startIDEProject(workspaceDirPath: string, config: WorkspaceConfig): Promise<void>;

    abstract async getIPlug2DependencyFileNames(): Promise<string[]>;
}
