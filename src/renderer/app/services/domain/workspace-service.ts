import {
    copyFile,
    createDirIfNotExists, createHardLink,
    deleteDirectory,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty,
    downloadFile,
    moveDir,
    moveDirContents,
    recreateDir,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {logActivity} from "@/renderer/app/services/ui/logging-service";

import * as path from "path";
import {Fsx} from "@/renderer/app/util/fsx";
import * as git from "@/renderer/app/util/git-utils";
import {Cpx} from "@/renderer/app/util/cpx";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {IdeService} from "@/renderer/app/services/domain/common/ide-service";
import {
    CONFIG_HEADER_FILE_NAME,
    DEFAULT_FONT_FILE_NAME,
    WorkspacePaths
} from "@/renderer/app/services/domain/common/paths";
import {readFile, writeFile} from "@/renderer/app/services/domain/config-service";
import {EOL} from "ts-loader/dist/constants";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {ComposerManagedContentBlock} from "@/renderer/app/util/composer-managed-content-block";


export class WorkspaceService {
    constructor(private fileService: FilesService, private ideService: IdeService) {
    }

    public getIdeName(): string {
        return this.ideService.getIdeName();
    }

    @logActivity("Starting IDE")
    public async startIDE(config: WorkspaceConfig, paths: WorkspacePaths) {
        await createDirIfNotExists(paths.getDependenciesDirPath());

        if (await this.shouldSetupIPlug2(paths)) {
            await this.downloadIPlug2FromGithub(paths, config.iPlug2GitSha);
        }

        if (await this.shouldSetupIPlug2Dependencies(paths)) {
            await this.downloadIPlug2DependenciesFromGithub(paths);
        }

        if (await this.shouldSetupVst3Sdk(paths)) {
            await this.downloadVstSdk(paths, "0908f47");
        }

        await this.generateProjectFromPrototype(paths, config);

        if (await this.shouldInitializeSourceFiles(paths)) {
            await this.initializeSourceFiles(paths, config);
        }

        if (await this.shouldInitializeFontFiles(paths)) {
            await this.initializeFontFiles(paths);
        }

        await this.removeDefaultPrototypeFontFiles(paths, config);

        // Always start with a clean composer managed configuration to keep files in-sync with config.h
        await this.writeConfigHComposerBlock(paths, "");

        await this.ideService.addUserSourceFilesToIDEProject(paths);
        await this.addUserFontFiles(paths);
        await this.addUserImageFiles(paths);

        await this.ideService.startIDEProject(paths);
    }

    async addUserFontFiles(paths: WorkspacePaths): Promise<void> {
        const fontsDir = paths.getIDEProjectFontResourcesDir();
        await createDirIfNotExists(fontsDir);

        const filePaths = await this.fileService.loadFontFileList(paths);

        for (const filePath of filePaths) {
            const variableName = this.getVariableNameForFile(filePath);
            await this.addFontToConfigH(paths, filePath, variableName);
            await createHardLink(filePath, path.join(fontsDir, path.basename(filePath)));
            await this.ideService.addImageFileToIdeProject(paths, variableName);
        }
    }

    async addUserImageFiles(paths: WorkspacePaths): Promise<void> {
        const imagesDir = paths.getIDEProjectImageResourcesDir();
        await createDirIfNotExists(imagesDir);

        const filePaths = await this.fileService.loadImageFilesList(paths);

        for (const filePath of filePaths) {
            const variableName = this.getVariableNameForFile(filePath);
            await this.addImageToConfigH(paths, filePath, variableName);
            await createHardLink(filePath, path.join(imagesDir, path.basename(filePath)));
            await this.ideService.addImageFileToIdeProject(paths, variableName);
        }
    }

    private async addImageToConfigH(paths: WorkspacePaths, fileName: string, variableName: string) {
        let configHBlockContent = await this.getConfigHComposerBlock(paths);
        const fontDefinition = `#define ${variableName} "${path.basename(fileName)}"`;

        // Adding font to config.h if not already present
        if (!configHBlockContent.includes(fontDefinition)) {
            configHBlockContent += `${fontDefinition}${EOL}`;
        }

        this.writeConfigHComposerBlock(paths, configHBlockContent);
    }

    private async addFontToConfigH(paths: WorkspacePaths, fileName: string, variableName: string) {
        let configHBlockContent = await this.getConfigHComposerBlock(paths);
        const fontDefinition = `#define ${variableName} "${path.basename(fileName)}"`;

        // Adding font to config.h if not already present
        if (!configHBlockContent.includes(fontDefinition)) {
            configHBlockContent += `${fontDefinition}${EOL}`;
        }

        this.writeConfigHComposerBlock(paths, configHBlockContent);
    }

    @logActivity("Cloning iPlug2 Git repo")
    async downloadIPlug2FromGithub(paths: WorkspacePaths, shaRef?: string): Promise<void> {
        const workDirPath = paths.getWorkDirPath();
        const zipFilePath = path.join(workDirPath, `${shaRef}.zip`);
        const zipFileContentDirPath = path.join(workDirPath, `iPlug2-${shaRef}`);
        const iPlug2Path = paths.getIPlug2BaseDirPath();

        await recreateDir(workDirPath);

        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
        await unzipFile(zipFilePath, workDirPath);

        await Fsx.unlink(zipFilePath);
        await deleteDirectory(iPlug2Path);

        await Fsx.rename(zipFileContentDirPath, iPlug2Path);
        await deleteDirectory(workDirPath);
    }

    @logActivity("Downloading iPlug2 prebuilt dependencies")
    async downloadIPlug2DependenciesFromGithub(paths: WorkspacePaths): Promise<void> {
        const dependenciesBuildDirPath = paths.getIPlug2DependenciesBuildPath();
        await recreateDir(dependenciesBuildDirPath);

        const dependencyFiles = await this.ideService.getIPlug2DependencyFileNames();
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
    async downloadVstSdk(paths: WorkspacePaths, sha1: string) {
        const targetDir = paths.getVst3SdkDirPath();
        await recreateDir(targetDir);

        await git.cloneRepo("git clone https://github.com/steinbergmedia/vst3sdk.git", sha1, targetDir);
        await git.initSubmodule("pluginterfaces", targetDir);
        await git.initSubmodule("base", targetDir);
        await git.initSubmodule("public.sdk", targetDir);
        await git.initSubmodule("doc", targetDir);
    }

    @logActivity("Creating project from iPlug2 prototype")
    async generateProjectFromPrototype(paths: WorkspacePaths, config: WorkspaceConfig): Promise<void> {
        const buildsDir = paths.getBuildsDir();
        const examplesPath = path.join(paths.getIPlug2BaseDirPath(), "Examples");

        await recreateDir(buildsDir);
        await Cpx.spawn(`python duplicate.py ${config.prototype} ${config.projectName} ${config.manufacturerName} ${buildsDir}`, examplesPath);

        await moveDir(path.join(buildsDir, config.projectName), paths.getProjectBuildDir());
    }

    @logActivity("Copying initial fonts from iPlug prototype project to project sources")
    async initializeFontFiles(paths: WorkspacePaths): Promise<void> {
        const resourcesDir = paths.getResourcesDir();
        const workspaceFontsDir = paths.getFontsDir();

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(workspaceFontsDir);

        const vsSolutionFontsDir = paths.getIDEProjectFontResourcesDir();
        const filesToCopy = path.join(vsSolutionFontsDir, DEFAULT_FONT_FILE_NAME);

        await copyFile(filesToCopy, path.join(workspaceFontsDir, path.basename(filesToCopy)));

        await this.ideService.initializeFontFilesInIDEProject(paths, this.getVariableNameForFile);
    }

    @logActivity("Copying initial sources from iPlug prototype project to project sources")
    async initializeSourceFiles(paths: WorkspacePaths, config: WorkspaceConfig): Promise<void> {
        const sourcesDir = paths.getSourcesDir();
        await createDirIfNotExists(sourcesDir);

        const filesToCopy = this.getDefaultPrototypeSourceFiles(paths, config);
        await Promise.all(filesToCopy.map(f => copyFile(f, path.join(sourcesDir, path.basename(f)))));
    }

    async shouldSetupIPlug2(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getIPlug2BaseDirPath());
    }

    async shouldSetupIPlug2Dependencies(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getIPlug2DependenciesBuildPath());
    }

    async shouldSetupVst3Sdk(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getVst3SdkDirPath(), ["README.md"]);
    }

    async shouldInitializeSourceFiles(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getSourcesDir());
    }

    async shouldInitializeFontFiles(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getFontsDir());
    }

    getDefaultPrototypeSourceFiles(paths: WorkspacePaths, config: WorkspaceConfig): string[] {
        const projectBuildDir = paths.getProjectBuildDir();

        return [CONFIG_HEADER_FILE_NAME, `${config.projectName}.h`, `${config.projectName}.cpp`]
            .map(file => path.join(projectBuildDir, file));
    }

    async removeDefaultPrototypeFontFiles(paths: WorkspacePaths, config: WorkspaceConfig): Promise<void> {
        const defaultPrototypeSourceFiles = this.getDefaultPrototypeSourceFiles(paths, config);
        await this.ideService.removeDefaultPrototypeSourceFilesFromIDEProject(paths, defaultPrototypeSourceFiles);
        await this.ideService.removeDefaultPrototypeFontFilesFromIDEProject(paths);
        const fontPath = paths.getIDEProjectFontResourcesDir();
        await deleteFileIfExists(path.join(fontPath, DEFAULT_FONT_FILE_NAME));
    }

    getVariableNameForFile(filePath: string): string {
        return path.basename(filePath)
            .replace(/[^a-z0-9+]+/gi, '_')
            .toUpperCase();
    }

    async getConfigHComposerBlock(paths: WorkspacePaths): Promise<string> {
        const configHPath = paths.getConfigHPath();
        let configHContent = await readFile(configHPath);
        return ComposerManagedContentBlock.extractFrom(configHContent).payload;
    }

    async writeConfigHComposerBlock(paths: WorkspacePaths, payload: string): Promise<void> {
        const configHPath = paths.getConfigHPath();
        const configHContent = await readFile(configHPath);

        const block = new ComposerManagedContentBlock(payload);
        const newConfigHContent = block.addToOrReplaceIn(configHContent);

        await writeFile(configHPath, newConfigHContent);
    }
}
