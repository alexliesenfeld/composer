import * as path from "path";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {Cpx} from "@/renderer/app/util/cpx";
import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {
    DEFAULT_FONT_FILE_NAME,
    getConfigHPath,
    getMainPluginCppFile,
    getMainRcPath,
    getProjectBuildDir,
    getSourcesDir,
    getVisualStudioAaxIDEProjectFilePath,
    getVisualStudioAaxIDEProjectFiltersFilePath,
    getVisualStudioAppIDEProjectFilePath,
    getVisualStudioAppIDEProjectFiltersFilePath,
    getVisualStudioIDEProjectsDir, getVisualStudioProjectFontResourcesDir,
    getVisualStudioProjectWinPropsPath,
    getVisualStudioSolutionFilePath,
    getVisualStudioVst2IDEProjectFilePath,
    getVisualStudioVst2IDEProjectFiltersFilePath,
    getVisualStudioVst3IDEProjectFilePath,
    getVisualStudioVst3IDEProjectFiltersFilePath,
    getWorkspaceDir,
    OperatingSystem
} from "@/renderer/app/services/domain/common";
import {AbstractWorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {AssertionError} from "@/renderer/app/model/errors";
import {readFile, writeFile} from "@/renderer/app/services/domain/config-service";
import {assertReplace, replace, replaceAll, times} from "@/renderer/app/util/string-utils";
import {assertReplaceContentInFile, copyFile, createHardLink, deleteFileIfExists} from "@/renderer/app/util/file-utils";
import {EOL} from "os"

const MAIN_RC_TEXTINCLUDE_FONT_RESOURCES_PLACEHOLDER = "//MAIN_RC_TEXTINCLUDE_FONT_RESOURCES_PLACEHOLDER";
const MAIN_RC_FONT_RESOURCES_PLACEHOLDER = "//MAIN_RC_FONT_RESOURCES_PLACEHOLDER";

/**
 * This is a service class to work with the workspace on Windows. It extends the base class with OS-specific
 * functionality.
 */
export class WindowsWorkspaceService extends AbstractWorkspaceService {

    /**
     * The main constructor.
     * @param fileService A file service that allows accessing source files.
     */
    constructor(fileService: FilesService) {
        super(fileService);
    }

    /**
     * Returns the operating system that this implementation supports.
     */
    getOs(): OperatingSystem {
        return OperatingSystem.WINDOWS;
    }

    /**
     * Returns the names of all default iPlug dependency files.
     */
    async getIPlug2DependencyFileNames(): Promise<string[]> {
        return ["IPLUG2_DEPS_WIN.zip"];
    }

    @logActivity("Starting Visual Studio project")
    async startIDEProject(workspaceDirPath: string, config: WorkspaceConfig): Promise<void> {
        const vsSolutionPath = getVisualStudioSolutionFilePath(workspaceDirPath, config, this.getOs());
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    async removeDefaultPrototypeSourceFiles(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
        const projectFiles = this.getAllVisualStudioProjectFiles(workspaceDir, config);
        const defaultPrototypeFiles = this.getDefaultPrototypeSourceFiles(workspaceDir, config);

        for (const fileToRemove of defaultPrototypeFiles) {
            await Promise.all(projectFiles
                .map(projectFile => this.removeSourceFileFromVisualStudioProjectFile(workspaceDir, config,
                    projectFile, fileToRemove)));
            await deleteFileIfExists(fileToRemove);
        }
    }

    async removeDefaultPrototypeFontFilesFromIDEProject(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
        const mainRcPath = getMainRcPath(workspaceDir, config, this.getOs());

        await assertReplaceContentInFile(
            mainRcPath,
            `"ROBOTO_FN TTF ROBOTO_FN\\0"`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later
            MAIN_RC_TEXTINCLUDE_FONT_RESOURCES_PLACEHOLDER
        );

        await assertReplaceContentInFile(
            mainRcPath,
            `ROBOTO_FN TTF ROBOTO_FN`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later.
            MAIN_RC_FONT_RESOURCES_PLACEHOLDER
        );
    }

    @logActivity("Adding source files to Visual Studio solution projects")
    async addUserSourceFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const workspaceDir = getWorkspaceDir(composerFilePath);
        const projectFiles = this.getAllVisualStudioProjectFiles(workspaceDir, config);
        const filePaths = (await this.filesService.loadSourceFilesList(composerFilePath));

        for (const fileToAdd of filePaths) {
            await Promise.all(projectFiles
                .map(projectFile =>
                    this.addSourceFileToVisualStudioProjectFile(workspaceDir, config, projectFile, fileToAdd)));
        }

        await this.changeConfigHeaderPathInMainRc(workspaceDir, config);
        await this.addUserSourcesToIncludePath(workspaceDir, config);
    }

    @logActivity("Adding font files to Visual Studio solution projects")
    async addUserFontFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const workspaceDir = getWorkspaceDir(composerFilePath);
        const filePaths = (await this.filesService.loadFontFileList(composerFilePath));

        for (const filePath of filePaths) {
            await this.addFontFileToVisualStudioProjects(workspaceDir, config, filePath);
        }

    }

    async initializeFontFilesInIDEProject(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
        const configHPath = getConfigHPath(workspaceDir, config, this.getOs());
        const mainCppFile = getMainPluginCppFile(workspaceDir, config);

        await assertReplaceContentInFile(configHPath, `#define ROBOTO_FN "Roboto-Regular.ttf"`, '');

        // As fonts have a naming scheme. We are therefore removing the default iPlug name for roboto and re-adding it
        // with the standard naming scheme.
        await assertReplaceContentInFile(mainCppFile, 'ROBOTO_FN', this.getVariableNameForForFile(`Roboto-Regular.ttf`));
    }

    private async addFontFileToVisualStudioProjects(workspaceDir: string, config: WorkspaceConfig, fontFileToAdd: string): Promise<void> {
        const variableName = this.getVariableNameForForFile(fontFileToAdd);
        const fontsDir = getVisualStudioProjectFontResourcesDir(workspaceDir, config, this.getOs());

        await this.addFontToMainRc(workspaceDir, config, variableName);
        await this.addFontToConfigH(workspaceDir, config, fontFileToAdd, variableName);

        await createHardLink(fontFileToAdd, path.join(fontsDir, path.basename(fontFileToAdd)));
    }

    private async addFontToMainRc(workspaceDir: string, config: WorkspaceConfig, variableName: string) {
        const mainRcPath = getMainRcPath(workspaceDir, config, this.getOs());
        let mainRcContent = await readFile(mainRcPath);

        // Adding Resource to section "3 TEXTINCLUDE"
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_TEXTINCLUDE_FONT_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_TEXTINCLUDE_FONT_RESOURCES_PLACEHOLDER}${EOL}"${variableName} TTF ${variableName}\\0"${EOL}`);

        // Adding Resource to section "Generated from the TEXTINCLUDE 3 resource."
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_FONT_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_FONT_RESOURCES_PLACEHOLDER}${EOL}${variableName} TTF ${variableName}${EOL}`);

        await writeFile(mainRcPath, mainRcContent);
    }

    private async addFontToConfigH(workspaceDir: string, config: WorkspaceConfig, fileName: string, variableName: string) {
        const configHPath = getConfigHPath(workspaceDir, config, this.getOs());
        const fontDefinition = `#define ${variableName} "${path.basename(fileName)}"`;

        let configHContent = await readFile(configHPath);

        // Adding font to config.h if not already present
        if (!configHContent.includes(fontDefinition)) {
            configHContent += `${fontDefinition}${EOL}`;
        }

        await writeFile(configHPath, configHContent);
    }

    private async addSourceFileToVisualStudioProjectFile(workspaceDir: string, config: WorkspaceConfig, vsProjectFile: string, fileToAdd: string): Promise<void> {
        const projectDir = getVisualStudioIDEProjectsDir(workspaceDir, config, this.getOs());
        let fileContent = await readFile(vsProjectFile);

        if (!this.projectFileContainsSourceFile(fileContent, projectDir, fileToAdd)) {
            fileContent = this.addSourceFileToProjectFile(fileContent, projectDir, fileToAdd);
        }

        await writeFile(vsProjectFile, fileContent);
    }

    /**
     * Because composer manages its own sources directory, we need to include this directory in the visual studio
     * project files. The easiest way to do this, is to change the "AdditionalIncludeDirectories" definition by just
     * adding the sources directory to this list.
     * @param workspaceDir The current workspace.
     * @param config The configuration.
     */
    private async addUserSourcesToIncludePath(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
        const winPropsPath = getVisualStudioProjectWinPropsPath(workspaceDir, config, this.getOs());
        const sourcesDir = getSourcesDir(workspaceDir);
        const solutionDir = getProjectBuildDir(workspaceDir, this.getOs());

        await assertReplaceContentInFile(
            winPropsPath,
            `</AdditionalIncludeDirectories>`,
            `;$(SolutionDir)${path.relative(solutionDir, sourcesDir)}</AdditionalIncludeDirectories>`
        );
    }

    /**
     * Because composer manages its own sources directory, we need to change the inclusion path for config.h
     * so that it points to the composer sources directory.
     * @param workspaceDir The current workspace.
     * @param config The configuration.
     */
    private async changeConfigHeaderPathInMainRc(workspaceDir: string, config: WorkspaceConfig): Promise<void> {
        const mainRcPath = getMainRcPath(workspaceDir, config, this.getOs());
        const configHPath = getConfigHPath(workspaceDir, config, this.getOs());
        const projectDir = getProjectBuildDir(workspaceDir, this.getOs());

        await assertReplaceContentInFile(
            mainRcPath,
            `#include "..\\config.h"`,
            `#include "${path.relative(projectDir, configHPath)}"`
        );

        await assertReplaceContentInFile(
            mainRcPath,
            `"#include ""..\\\\config.h""\\r\\n"`,
            `"#include ""${replaceAll(path.relative(projectDir, configHPath), path.sep, times(path.sep, 2))}""\\r\\n"`
        );
    }

    private async removeSourceFileFromVisualStudioProjectFile(workspaceDir: string, config: WorkspaceConfig, vsProjectFile: string, fileToRemove: string): Promise<void> {
        const projectDir = getVisualStudioIDEProjectsDir(workspaceDir, config, this.getOs());
        let fileContent = await readFile(vsProjectFile);

        if (this.projectFileContainsSourceFile(fileContent, projectDir, fileToRemove)) {
            fileContent = this.removeSourceFileFromProjectFile(vsProjectFile, fileContent, projectDir, fileToRemove);
        }

        await writeFile(vsProjectFile, fileContent);
    }

    private projectFileContainsSourceFile(vsProjectFileContent: string, projectDir: string, filePath: string) {
        const allRelativeFilePaths = this.getPossibleFilePaths(path.relative(projectDir, filePath));

        for (const relativeFilePath of allRelativeFilePaths) {
            if (vsProjectFileContent.includes(this.getSourceFileInclusionSnippet(relativeFilePath))) {
                return true;
            }
        }

        return false;
    }

    private getPossibleFilePaths(filePath: string): string[] {
        return [
            filePath,
            // The path separator is used inconsistently in some prototypes files.
            replaceAll(filePath, path.sep, "/")
        ];
    }

    private addSourceFileToProjectFile(vsProjectFileContent: string, projectDir: string, filePath: string): string {
        const snippet = this.getSourceFileInclusionSnippet(path.relative(projectDir, filePath));
        return assertReplace(vsProjectFileContent, `</Project>`, `<ItemGroup>${snippet}</ItemGroup></Project>`);
    }

    private removeSourceFileFromProjectFile(fileName: string, vsProjectFileContent: string, projectDir: string, filePath: string): string {
        const possiblePaths = this.getPossibleFilePaths(path.relative(projectDir, filePath));

        for (const relativeFilePath of possiblePaths) {
            const snippet = this.getSourceFileInclusionSnippet(relativeFilePath);
            const result = replace(vsProjectFileContent, snippet, "");
            if (result.success) {
                return result.newContent;
            }
        }

        throw new AssertionError(`Could not remove file ${fileName} from ${vsProjectFileContent}.`)
    }

    private getSourceFileInclusionSnippet(relativeFilePath: string) {
        const ext = path.extname(relativeFilePath);
        switch (ext) {
            case ".h":
            case ".hpp":
                return `<ClInclude Include="${relativeFilePath}" />`;
            case ".cpp":
                return `<ClCompile Include="${relativeFilePath}" />`;
            default:
                throw new AssertionError(`Unsupported file extension '${ext}'`);
        }
    }

    private getAllVisualStudioProjectFiles(workspaceDir: string, config: WorkspaceConfig): string[] {
        const os = this.getOs();
        return [
            getVisualStudioAppIDEProjectFilePath(workspaceDir, config, os),
            getVisualStudioVst2IDEProjectFilePath(workspaceDir, config, os),
            getVisualStudioVst3IDEProjectFilePath(workspaceDir, config, os),
            getVisualStudioAaxIDEProjectFilePath(workspaceDir, config, os),
            getVisualStudioAppIDEProjectFiltersFilePath(workspaceDir, config, os),
            getVisualStudioVst2IDEProjectFiltersFilePath(workspaceDir, config, os),
            getVisualStudioVst3IDEProjectFiltersFilePath(workspaceDir, config, os),
            getVisualStudioAaxIDEProjectFiltersFilePath(workspaceDir, config, os)
        ];
    }

}
