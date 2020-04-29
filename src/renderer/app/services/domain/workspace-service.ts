import {Fsx} from "@/renderer/app/util/fsx";
import * as path from "path";
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
import {PluginFormat, WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {AssertionError, OperationFailedError, UnsupportedOperationError} from "@/renderer/app/model/errors";
import * as git from "@/renderer/app/util/git-utils";
import {Cpx} from "@/renderer/app/util/cpx";
import {log, logActivity} from "@/renderer/app/services/ui/logging-service";
import {
    getDependenciesDirPath,
    getIPlug2BaseDirPath,
    getIPlug2DependenciesBuildPath,
    getProjectBuildPath,
    getVisualStudioAaxIDEProjectFilePath,
    getVisualStudioAaxIDEProjectFiltersFilePath,
    getVisualStudioAppIDEProjectFilePath,
    getVisualStudioAppIDEProjectFiltersFilePath,
    getVisualStudioIDEProjectsFilePath,
    getVisualStudioSolutionDirPath,
    getVisualStudioSolutionFilePath,
    getVisualStudioVst2IDEProjectFilePath,
    getVisualStudioVst2IDEProjectFiltersFilePath,
    getVisualStudioVst3IDEProjectFilePath,
    getVisualStudioVst3IDEProjectFiltersFilePath,
    getVst3SdkDirPath,
    getWorkDirPath,
    getWorkspaceDir,
    OperatingSystem
} from "@/renderer/app/services/domain/common";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {readFile} from "ts-loader/dist/utils";
import {writeFile} from "@/renderer/app/services/domain/config-service";

export class WorkspaceService {

    constructor(private filesService: FilesService) {

    }

    @logActivity("Starting IDE")
    async startIDE(userConfigFilePath: string, config: WorkspaceConfig, os: OperatingSystem) {
        const workspaceDir = getWorkspaceDir(userConfigFilePath);
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
            await this.createProjectSources(userConfigFilePath, config, os);
            // await this.replaceProjectVariables(workspaceDir, config);
        }

        if (os === OperatingSystem.WINDOWS) {
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
    async downloadIPlug2DependenciesFromGithub(workspaceDirPath: string, config: WorkspaceConfig, os: OperatingSystem): Promise<void> {
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
    async startVisualStudioProject(workspaceDirPath: string, config: WorkspaceConfig, os: OperatingSystem): Promise<void> {
        const vsSolutionPath = getVisualStudioSolutionFilePath(workspaceDirPath, config);
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    @logActivity("Creating project from iPlug2 prototype")
    async createProjectSources(composerFilePath: string, config: WorkspaceConfig, os: OperatingSystem): Promise<void> {
        const workspaceDirPath = getWorkspaceDir(composerFilePath);
        const buildPath = getProjectBuildPath(workspaceDirPath);
        const examplesPath = path.join(getIPlug2BaseDirPath(workspaceDirPath), "Examples");

        await recreateDir(buildPath);
        await Cpx.spawn(`python duplicate.py ${config.prototype} ${config.projectName} ${config.manufacturerName} ${buildPath}`, examplesPath);

        await this.removeGeneratedPrototypeSourceFilesFromIDEProject(composerFilePath, config, os);
        await this.addSourceFilesToIDEProject(composerFilePath, config, os);
    }

    @logActivity("Replacing configuration variables")
    async replaceProjectVariables(workspaceDirPath: string, config: WorkspaceConfig): Promise<void> {
        await this.replaceWindowsProjectVariables(workspaceDirPath, config);
    }

    @logActivity("Replacing Windows configuration variables")
    async replaceWindowsProjectVariables(workspaceDirPath: string, config: WorkspaceConfig): Promise<void> {
        /*const winPropsFilePath = getProjectWinPropertiesPath(workspaceDirPath, config);
        let winPropsFileContent = readFile(winPropsFilePath);
        if (!winPropsFileContent) {
            throw new AssertionError("The windows project props file project seems to be empty. Cannot proceed.");
        }

        this.replaceString(
            winPropsFileContent,
            "<Import Project=\"$(IPLUG2_ROOT)\\common-win.props\" />",
            "<Import Project=\"$(IPLUG2_ROOT)\\..\\..\\src\\common-win.props\" />"
        );

        await writeFile(winPropsFilePath, winPropsFileContent);
         */
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
        return await directoryDoesNotExistOrIsEmpty(getProjectBuildPath(workspaceDirPath));
    }

    private replaceString(content: string, from: string, to: string) {
        const newContent = content.replace(from, to);
        if (newContent === content) {
            throw new AssertionError("Content could not be replaced");
        }
    }


    @logActivity("Adding source files")
    async addSourceFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig, os: OperatingSystem): Promise<void> {
        if (os === OperatingSystem.WINDOWS) {
            return this.addSourceFilesToVisualStudioProject(composerFilePath, config);
        }

        throw new UnsupportedOperationError(`Operating system ${os} not supported`);
    }

    @logActivity("Cleaning project from prototype files")
    private async removeGeneratedPrototypeSourceFilesFromIDEProject(composerFilePath: string, config: WorkspaceConfig, os: OperatingSystem): Promise<void> {
        if (os === OperatingSystem.WINDOWS) {
            return this.removeGeneratedPrototypeSourceFilesFromVisualStudioProject(composerFilePath, config);
        }

        throw new UnsupportedOperationError(`Operating system ${os} not supported`);
    }

    @logActivity("Cleaning project from prototype files")
    private async removeGeneratedPrototypeSourceFilesFromVisualStudioProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const solutionDirPath = getVisualStudioSolutionDirPath(getWorkspaceDir(composerFilePath), config);

        await this.removeSourceFileFromVisualStudioProject(composerFilePath, config, path.join(solutionDirPath, "config.h"));
        await this.removeSourceFileFromVisualStudioProject(composerFilePath, config, path.join(solutionDirPath, `${config.projectName}.h`));
        await this.removeSourceFileFromVisualStudioProject(composerFilePath, config, path.join(solutionDirPath, `${config.projectName}.cpp`));
    }

    private async removeSourceFileFromVisualStudioProject(composerFilePath: string, config: WorkspaceConfig, filePath: string) {
        const workspaceDir = getWorkspaceDir(composerFilePath);
        const vsProjectsDirPath = getVisualStudioIDEProjectsFilePath(workspaceDir, config);
        const relativeFilePath = path.relative(vsProjectsDirPath, filePath).replace("/", path.sep);

        const vsProjectFiles = [
            getVisualStudioAppIDEProjectFilePath(workspaceDir, config),
            getVisualStudioVst2IDEProjectFilePath(workspaceDir, config),
            getVisualStudioVst3IDEProjectFilePath(workspaceDir, config),
            getVisualStudioAaxIDEProjectFilePath(workspaceDir, config),
            getVisualStudioAppIDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioVst2IDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioVst3IDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioAaxIDEProjectFiltersFilePath(workspaceDir, config)
        ];

        for (const p of vsProjectFiles) {
            await this.removeSourceFileFromVisualStudioProjectFile(p, relativeFilePath);
        }

        if (!(await deleteFileIfExists(filePath))) {
            throw new OperationFailedError(`Could not delete '${filePath}'.`)
        }
    }

    private async removeSourceFileFromVisualStudioProjectFile(vsProjectFilePath: string, relativeFilePath: string) {
        const fileExtension = path.extname(relativeFilePath);
        switch (fileExtension) {
            case ".h":
            case ".hpp":
                await this.removeClIncludeInFile(vsProjectFilePath, relativeFilePath);
                break;
            case ".cpp":
                await this.removeClCompileInFile(vsProjectFilePath, relativeFilePath);
                break;
            default:
                throw new AssertionError(`Source file extension ${fileExtension} not supported`);
        }
    }

    private async removeClIncludeInFile(vsFilePath: string, filePathToRemove: string) {
        try {
            await this.replaceContentInFile(vsFilePath, `<ClInclude Include="${filePathToRemove}" />`, "");
        } catch (err) {
            // At some places iPlug creates file paths with inconsistent path separators (/, \)
            await this.replaceContentInFile(vsFilePath, `<ClInclude Include="${filePathToRemove.replace(path.sep, "/")}" />`, "");
        }
    }

    private async removeClCompileInFile(vsFilePath: string, filePathToRemove: string) {
        try {
            await this.replaceContentInFile(vsFilePath, `<ClCompile Include="${filePathToRemove}" />`, "");
        } catch (err) {
            // At some places iPlug creates file paths with inconsistent path separators (/, \)
            await this.replaceContentInFile(vsFilePath, `<ClCompile Include="${filePathToRemove.replace(path.sep, "/")}" />`, "");
        }
    }

    private async replaceContentInFile(filePath: string, from: string, to: string) {
        const fileContent = await readFile(filePath);
        if (!fileContent) {
            throw new OperationFailedError(`Could not open '${filePath}'.`)
        }

        const replacedFileContent = fileContent.replace(from, to);
        if (!replacedFileContent || replacedFileContent === fileContent) {
            throw new AssertionError(`Could not replace string '${from}' to '${to}'in file ${filePath}.`)
        }

        await writeFile(filePath, replacedFileContent);
    }

    @logActivity("Adding source files to Visual Studio project")
    private async addSourceFilesToVisualStudioProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const projectPath = getVisualStudioIDEProjectsFilePath(getWorkspaceDir(composerFilePath), config);
        const filePaths = await this.filesService.loadSourceFilesList(composerFilePath);

        let content = "";
        for (const filePath of filePaths) {
            log(`Adding ${filePath} to Visual Studio project`);
            content += this.createVisualStudioProjectFileEntry(filePath, projectPath) + "\n";
        }
    }

    private createVisualStudioProjectFileEntry(filePath: string, appIDEProjectPath: string) {
        return `<ClInclude Include="${path.relative(appIDEProjectPath, filePath)}" />`;
    }


}
