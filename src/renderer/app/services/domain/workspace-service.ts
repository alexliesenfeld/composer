import { OperationFailedError } from '@/renderer/app/model/errors';
import {
    IPlugPluginType,
    PluginFormat,
    Prototype,
    WorkspaceConfig,
} from '@/renderer/app/model/workspace-config';
import { IdeService } from '@/renderer/app/services/domain/common/ide-service';
import {
    DEFAULT_FONT_FILE_NAME,
    WorkspacePaths,
} from '@/renderer/app/services/domain/common/paths';
import { FilesService } from '@/renderer/app/services/domain/files-service';
import { logActivity } from '@/renderer/app/services/ui/logging-service';
import { Cpx } from '@/renderer/app/util/cpx';
import {
    addLineToFile,
    copyFile,
    createDirIfNotExists,
    createHardLink,
    deleteDirectory,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty,
    downloadFile,
    moveDir,
    moveDirContents,
    recreateDir,
    unzipFile,
    writeFile,
} from '@/renderer/app/util/file-utils';
import { Fsx } from '@/renderer/app/util/fsx';
import * as git from '@/renderer/app/util/git-utils';
import { multiline, prependFill } from '@/renderer/app/util/string-utils';
import { enumValues } from '@/renderer/app/util/type-utils';
import * as path from 'path';

export class WorkspaceService {
    constructor(private fileService: FilesService, private ideService: IdeService) {}

    public getIdeName(): string {
        return this.ideService.getIdeName();
    }

    @logActivity('Starting IDE')
    public async startIDE(config: WorkspaceConfig, paths: WorkspacePaths) {
        await createDirIfNotExists(paths.getDependenciesDirPath());

        if (await this.shouldSetupIPlug2(paths)) {
            await this.downloadIPlug2FromGithub(paths, config.iPlug2GitHash);
        }

        if (await this.shouldSetupIPlug2Dependencies(paths)) {
            await this.downloadIPlug2DependenciesFromGithub(paths);
        }

        if (await this.shouldSetupVst3Sdk(paths)) {
            await this.downloadVstSdk(paths, config);
        }

        await this.generateProjectFromPrototype(paths, config);

        if (await this.shouldInitializeSourceFiles(paths)) {
            await this.initializeSourceFiles(paths, config);
        }

        if (await this.shouldInitializeFontFiles(paths)) {
            await this.initializeFontFiles(paths);
        }

        await this.removeDefaultPrototypeFontFiles(paths, config);

        await this.writeConfigHeaderFile(paths, config);

        await this.ideService.addUserSourceFilesToIDEProject(paths);
        await this.addUserFontFiles(paths);
        await this.addUserImageFiles(paths);

        await this.ideService.reconfigureFileFilters(paths);

        await this.excludeUnselectedPluginFormats(paths, config);

        await this.ideService.startIDEProject(paths);
    }

    private async excludeUnselectedPluginFormats(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): Promise<void> {
        const formatsToExclude = enumValues(PluginFormat).filter(
            (format) => !config.formats.includes(format),
        );

        for (const format of formatsToExclude) {
            await this.ideService.removeFormatFromIdeProject(paths, format, config);
        }
    }

    @logActivity('Adding user font files to IDE project')
    public async addUserFontFiles(paths: WorkspacePaths): Promise<void> {
        const fontsDir = paths.getIDEProjectFontResourcesDir();
        await createDirIfNotExists(fontsDir);

        const filePaths = await this.fileService.loadFontFileList(paths);

        for (const filePath of filePaths) {
            const variableName = this.getVariableNameForFile(filePath);
            await this.addFontToConfigH(paths, filePath, variableName);
            await createHardLink(filePath, path.join(fontsDir, path.basename(filePath)));
            await this.ideService.addFontFileToIdeProject(paths, variableName);
        }
    }

    @logActivity('Adding user image files to IDE project')
    public async addUserImageFiles(paths: WorkspacePaths): Promise<void> {
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

    @logActivity('Cloning iPlug2 Git repo')
    public async downloadIPlug2FromGithub(paths: WorkspacePaths, shaRef?: string): Promise<void> {
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

    @logActivity('Downloading iPlug2 prebuilt dependencies')
    public async downloadIPlug2DependenciesFromGithub(paths: WorkspacePaths): Promise<void> {
        const dependenciesBuildDirPath = paths.getIPlug2DependenciesBuildPath();
        await recreateDir(dependenciesBuildDirPath);

        const dependencyFiles = await this.ideService.getIPlug2DependencyFileNames();
        for (const file of dependencyFiles) {
            await this.downloadIPlug2DependenciesFile(file, dependenciesBuildDirPath);
        }
    }

    @logActivity('Downloading iPlug2 prebuilt dependency file #{0}')
    public async downloadIPlug2DependenciesFile(
        fileName: string,
        targetDirPath: string,
    ): Promise<void> {
        const filePath = path.join(targetDirPath, fileName);
        await downloadFile(
            `https://github.com/iPlug2/iPlug2/releases/download/setup/${fileName}`,
            filePath,
        );
        await unzipFile(filePath, targetDirPath);
        await deleteFileIfExists(filePath);

        const zipContentsDirectoryPath = path.join(targetDirPath, fileName.replace('.zip', ''));
        await moveDirContents(zipContentsDirectoryPath, targetDirPath);

        await deleteDirectory(zipContentsDirectoryPath);
    }

    @logActivity('Cloning VST3 SDK Git repo')
    public async downloadVstSdk(paths: WorkspacePaths, config: WorkspaceConfig) {
        const targetDir = paths.getVst3SdkDirPath();
        await recreateDir(targetDir);

        await git.cloneRepo(
            'git clone https://github.com/steinbergmedia/vst3sdk.git',
            config.vst3SdkGitHash,
            targetDir,
        );
        await git.initSubmodule('pluginterfaces', targetDir);
        await git.initSubmodule('base', targetDir);
        await git.initSubmodule('public.sdk', targetDir);
        await git.initSubmodule('doc', targetDir);
    }

    @logActivity('Creating project from iPlug2 prototype')
    public async generateProjectFromPrototype(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): Promise<void> {
        const buildsDir = paths.getBuildsDir();
        const examplesPath = path.join(paths.getIPlug2BaseDirPath(), 'Examples');
        const prototype = this.mapPluginTypeToPrototype(config.pluginType);

        await recreateDir(buildsDir);
        await Cpx.spawn(
            `python duplicate.py ${prototype} ${config.projectName} ${config.manufacturerName} ${buildsDir}`,
            examplesPath,
        );

        await moveDir(path.join(buildsDir, config.projectName), paths.getProjectBuildDir());
    }

    @logActivity('Copying initial fonts from iPlug prototype project to project sources')
    public async initializeFontFiles(paths: WorkspacePaths): Promise<void> {
        const resourcesDir = paths.getResourcesDir();
        const workspaceFontsDir = paths.getFontsDir();

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(workspaceFontsDir);

        const vsSolutionFontsDir = paths.getIDEProjectFontResourcesDir();
        const filesToCopy = path.join(vsSolutionFontsDir, DEFAULT_FONT_FILE_NAME);

        await copyFile(filesToCopy, path.join(workspaceFontsDir, path.basename(filesToCopy)));

        await this.ideService.initializeFontFilesInIDEProject(paths, this.getVariableNameForFile);
    }

    @logActivity('Copying initial sources from iPlug prototype project to project sources')
    public async initializeSourceFiles(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): Promise<void> {
        const sourcesDir = paths.getSourcesDir();
        await createDirIfNotExists(sourcesDir);

        const filesToCopy = this.getDefaultPrototypeSourceFiles(paths, config);
        await Promise.all(
            filesToCopy.map((f) => copyFile(f, path.join(sourcesDir, path.basename(f)))),
        );
    }

    public async shouldSetupIPlug2(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getIPlug2BaseDirPath());
    }

    public async shouldSetupIPlug2Dependencies(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getIPlug2DependenciesBuildPath());
    }

    public async shouldSetupVst3Sdk(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getVst3SdkDirPath(), ['README.md']);
    }

    public async shouldInitializeSourceFiles(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getSourcesDir());
    }

    public async shouldInitializeFontFiles(paths: WorkspacePaths): Promise<boolean> {
        return directoryDoesNotExistOrIsEmpty(paths.getFontsDir());
    }

    public getDefaultPrototypeSourceFiles(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): string[] {
        const projectBuildDir = paths.getProjectBuildDir();
        const filesNames = [`${config.projectName}.h`, `${config.projectName}.cpp`];
        if (this.mapPluginTypeToPrototype(config.pluginType) === Prototype.IPLUGINSTRUMENT) {
            filesNames.push(`${config.projectName}_DSP.h`);
        }
        return filesNames.map((file) => path.join(projectBuildDir, file));
    }

    public async removeDefaultPrototypeFontFiles(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): Promise<void> {
        const defaultPrototypeSourceFiles = this.getDefaultPrototypeSourceFiles(paths, config);
        await this.ideService.removeDefaultPrototypeSourceFilesFromIDEProject(
            paths,
            defaultPrototypeSourceFiles,
        );
        await this.ideService.removeDefaultPrototypeFontFilesFromIDEProject(paths);
        const fontPath = paths.getIDEProjectFontResourcesDir();
        await deleteFileIfExists(path.join(fontPath, DEFAULT_FONT_FILE_NAME));
    }

    public getVariableNameForFile(filePath: string): string {
        return path
            .basename(filePath)
            .replace(/[^a-z0-9+]+/gi, '_')
            .toUpperCase();
    }

    public async writeConfigHeaderFile(
        paths: WorkspacePaths,
        config: WorkspaceConfig,
    ): Promise<void> {
        return writeFile(
            paths.getConfigHPath(),
            multiline(
                `// ********************************************************************`,
                `// This file is generated by Composer. All changes here will be lost.`,
                `// ********************************************************************`,
                `#define PLUG_NAME "${config.projectName}"`,
                `#define PLUG_MFR "${config.manufacturerName}"`,
                `#define PLUG_VERSION_HEX 0x${this.mapVersionToHex(config.pluginVersion)}`,
                `#define PLUG_VERSION_STR "${config.pluginVersion}"`,
                `#define PLUG_UNIQUE_ID '${config.vstUniqueId}'`,
                `#define PLUG_MFR_ID '${config.manufacturerId}'`,
                `#define PLUG_URL_STR "${config.manufacturerWebsite}"`,
                `#define PLUG_EMAIL_STR "${config.manufacturerEmail}"`,
                `#define PLUG_COPYRIGHT_STR "${config.manufacturerCopyrightNotice}"`,
                `#define PLUG_CLASS_NAME ${config.projectName}`,
                ``,
                `#define PLUG_CHANNEL_IO "${config.inputChannels}-${config.outputChannels}"`,
                `#define PLUG_LATENCY ${config.pluginLatency}`,
                `#define PLUG_TYPE ${this.mapAudioUnitTypeForConfig(config.pluginType)}`,
                `#define PLUG_DOES_MIDI_IN ${this.mapBooleanForConfig(config.midiIn)}`,
                `#define PLUG_DOES_MIDI_OUT ${this.mapBooleanForConfig(config.midiOut)}`,
                `#define PLUG_DOES_MPE ${this.mapBooleanForConfig(config.mpe)}`,
                `#define PLUG_DOES_STATE_CHUNKS ${this.mapBooleanForConfig(config.stateChunks)}`,
                `#define PLUG_HAS_UI ${this.mapBooleanForConfig(config.uiEnabled)}`,
                `#define PLUG_WIDTH ${config.uiWidth}`,
                `#define PLUG_HEIGHT ${config.uiHeight}`,
                `#define PLUG_FPS ${config.fps}`,
                `#define PLUG_SHARED_RESOURCES 0`,
                ``,
                ``,
                `#define BUNDLE_NAME "${config.audioUnitBundleName}"`,
                `#define BUNDLE_MFR "${config.audioUnitBundleManufacturer}"`,
                `#define BUNDLE_DOMAIN "${config.audioUnitBundleDomain}"`,
                ``,
                `#define SHARED_RESOURCES_SUBPATH "${config.projectName}"`,
                `#define AUV2_ENTRY ${config.projectName}_Entry`,
                `#define AUV2_ENTRY_STR "${config.projectName}_Entry"`,
                `#define AUV2_FACTORY ${config.projectName}_Factory`,
                `#define AUV2_VIEW_CLASS ${config.projectName}_View`,
                `#define AUV2_VIEW_CLASS_STR "${config.projectName}_View"`,
                ``,
                `#define AAX_TYPE_IDS 'EFN1', 'EFN2'`,
                `#define AAX_TYPE_IDS_AUDIOSUITE 'EFA1', 'EFA2'`,
                `#define AAX_PLUG_MFR_STR "Acme"`,
                `#define AAX_PLUG_NAME_STR "${config.projectName}\\nIPEF"`,
                `#define AAX_PLUG_CATEGORY_STR "Effect"`,
                `#define AAX_DOES_AUDIOSUITE 1`,
                ``,
                `#define VST3_SUBCATEGORY "${config.vst3Subcategory}"`,
                ``,
                `#define APP_N_VECTOR_WAIT ${config.appVectorWaitMultiplier}`,
                `#define APP_MULT ${config.appOutputMultiplier}`,
                `#define APP_SIGNAL_VECTOR_SIZE ${config.appSignalVectorSize}`,
                // TODO: How useful are the following constants?
                `#define APP_NUM_CHANNELS 2`,
                `#define APP_RESIZABLE 0`,
                `#define APP_COPY_AUV3 0`,
                ``,
                ``,
            ),
        );
    }

    private async addImageToConfigH(paths: WorkspacePaths, fileName: string, variableName: string) {
        return addLineToFile(
            paths.getConfigHPath(),
            `#define ${variableName} "${path.basename(fileName)}"`,
        );
    }

    private async addFontToConfigH(paths: WorkspacePaths, fileName: string, variableName: string) {
        return addLineToFile(
            paths.getConfigHPath(),
            `#define ${variableName} "${path.basename(fileName)}"`,
        );
    }

    private mapAudioUnitTypeForConfig(value: IPlugPluginType) {
        return enumValues(IPlugPluginType).indexOf(value);
    }

    private mapVersionToHex(value: string) {
        const parts: string[] = value.split('.');
        const major = prependFill(parseInt(parts[0]).toString(16), 4, '0');
        const minor = prependFill(parseInt(parts[1]).toString(16), 2, '0');
        const patch = prependFill(parseInt(parts[2]).toString(16), 2, '0');

        if (major.length > 4 || minor.length > 2 || patch.length > 2) {
            throw new OperationFailedError(
                'Version number too long. Maximum version values are "65535.255.255".',
            );
        }

        return major + minor + patch;
    }

    private mapBooleanForConfig(value: boolean) {
        return value ? '1' : '0';
    }

    private mapPluginTypeToPrototype(pluginType: IPlugPluginType): Prototype {
        return pluginType === IPlugPluginType.INSTRUMENT
            ? Prototype.IPLUGINSTRUMENT
            : Prototype.IPLIGEFFECT;
    }
}
