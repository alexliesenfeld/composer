import * as path from "path";
import {Cpx} from "@/renderer/app/util/cpx";
import {logActivity} from "@/renderer/app/services/ui/logging-service";

import {FilesService} from "@/renderer/app/services/domain/files-service";
import {AssertionError} from "@/renderer/app/model/errors";
import {readFile, writeFile} from "@/renderer/app/services/domain/config-service";
import {assertReplace, replace, replaceAll, times} from "@/renderer/app/util/string-utils";
import {
    assertReplaceContentInFile,
    deleteFileIfExists
} from "@/renderer/app/util/file-utils";
import {EOL} from "ts-loader/dist/constants";
import {IdeService, VariableNameTranslator} from "@/renderer/app/services/domain/common/ide-service";
import {WorkspacePaths} from "@/renderer/app/services/domain/common/paths";

const MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER = "//MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER";
const MAIN_RC_RESOURCES_PLACEHOLDER = "//MAIN_RC_RESOURCES_PLACEHOLDER";

/**
 * This is a service class to work with the workspace on Windows. It extends the base class with OS-specific
 * functionality.
 */
export class VisualStudioIdeService implements IdeService {

    /**
     * The main constructor.
     * @param fileService A file service that allows accessing source files.
     */
    constructor(private fileService: FilesService) {
    }

    getIdeName(): string {
        return "Visual Studio";
    }

    /**
     * Returns the names of all default iPlug dependency files.
     */
    async getIPlug2DependencyFileNames(): Promise<string[]> {
        return ["IPLUG2_DEPS_WIN.zip"];
    }

    @logActivity("Starting Visual Studio project")
    async startIDEProject(context: WorkspacePaths): Promise<void> {
        const vsSolutionPath = context.getVisualStudioSolutionFilePath();
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    async removeDefaultPrototypeSourceFilesFromIDEProject(context: WorkspacePaths, defaultPrototypeFiles: string[]): Promise<void> {
        const projectFiles = this.getAllVisualStudioProjectFiles(context);

        for (const fileToRemove of defaultPrototypeFiles) {
            await Promise.all(projectFiles
                .map(projectFile => this.removeSourceFileFromVisualStudioProjectFile(context, projectFile, fileToRemove)));
            await deleteFileIfExists(fileToRemove);
        }
    }

    async removeDefaultPrototypeFontFilesFromIDEProject(context: WorkspacePaths): Promise<void> {
        const mainRcPath = context.getMainRcPath();

        await assertReplaceContentInFile(
            mainRcPath,
            `"ROBOTO_FN TTF ROBOTO_FN\\0"`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later
            MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER
        );

        await assertReplaceContentInFile(
            mainRcPath,
            `ROBOTO_FN TTF ROBOTO_FN`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later.
            MAIN_RC_RESOURCES_PLACEHOLDER
        );
    }

    @logActivity("Adding source files to Visual Studio solution projects")
    async addUserSourceFilesToIDEProject(context: WorkspacePaths): Promise<void> {
        const projectFiles = this.getAllVisualStudioProjectFiles(context);
        const filePaths = (await this.fileService.loadSourceFilesList(context));

        for (const fileToAdd of filePaths) {
            await Promise.all(projectFiles
                .map(projectFile =>
                    this.addSourceFileToVisualStudioProjectFile(context, projectFile, fileToAdd)));
        }

        await this.changeConfigHeaderPathInMainRc(context);
        await this.addUserSourcesToIncludePath(context);
    }

    async initializeFontFilesInIDEProject(context: WorkspacePaths, translateToVariable: VariableNameTranslator): Promise<void> {
        await assertReplaceContentInFile(context.getConfigHPath(), `#define ROBOTO_FN "Roboto-Regular.ttf"`, '');

        // As fonts have a naming scheme. We are therefore removing the default iPlug name for roboto and re-adding it
        // with the standard naming scheme.
        await assertReplaceContentInFile(context.getMainPluginCppFile(), 'ROBOTO_FN',
            translateToVariable(`Roboto-Regular.ttf`));
    }

    async addImageFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void> {
        const mainRcPath = paths.getMainRcPath();
        let mainRcContent = await readFile(mainRcPath);

        // Adding Resource to section "3 TEXTINCLUDE"
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER}${EOL}"${variableName} PNG ${variableName}\\0"${EOL}`);

        // Adding Resource to section "Generated from the TEXTINCLUDE 3 resource."
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_RESOURCES_PLACEHOLDER}${EOL}${variableName} PNG ${variableName}${EOL}`);

        await writeFile(mainRcPath, mainRcContent);
    }

    async addFontFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void> {
        const mainRcPath = paths.getMainRcPath();
        let mainRcContent = await readFile(mainRcPath);

        // Adding Resource to section "3 TEXTINCLUDE"
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER}${EOL}"${variableName} TTF ${variableName}\\0"${EOL}`);

        // Adding Resource to section "Generated from the TEXTINCLUDE 3 resource."
        mainRcContent = assertReplace(mainRcContent, MAIN_RC_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_RESOURCES_PLACEHOLDER}${EOL}${variableName} TTF ${variableName}${EOL}`);

        await writeFile(mainRcPath, mainRcContent);
    }

    private async addSourceFileToVisualStudioProjectFile(context: WorkspacePaths, vsProjectFile: string, fileToAdd: string): Promise<void> {
        const projectDir = context.getVisualStudioIDEProjectsDir();
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
     * @param context The current workspace context.
     */
    private async addUserSourcesToIncludePath(context: WorkspacePaths): Promise<void> {
        const winPropsPath = context.getVisualStudioProjectWinPropsPath();
        const sourcesDir = context.getSourcesDir();
        const solutionDir = context.getProjectBuildDir();

        await assertReplaceContentInFile(
            winPropsPath,
            `</AdditionalIncludeDirectories>`,
            `;$(SolutionDir)${path.relative(solutionDir, sourcesDir)}</AdditionalIncludeDirectories>`
        );
    }

    /**
     * Because composer manages its own sources directory, we need to change the inclusion path for config.h
     * so that it points to the composer sources directory.
     * @param context The current workspace context.
     */
    private async changeConfigHeaderPathInMainRc(context: WorkspacePaths): Promise<void> {
        const mainRcPath = context.getMainRcPath();
        const configHPath = context.getConfigHPath();
        const projectDir = context.getProjectBuildDir();

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

    private async removeSourceFileFromVisualStudioProjectFile(context: WorkspacePaths, vsProjectFile: string, fileToRemove: string): Promise<void> {
        const projectDir = context.getVisualStudioIDEProjectsDir();
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

    private getAllVisualStudioProjectFiles(context: WorkspacePaths): string[] {
        return [
            context.getVisualStudioAppIDEProjectFilePath(),
            context.getVisualStudioVst2IDEProjectFilePath(),
            context.getVisualStudioVst3IDEProjectFilePath(),
            context.getVisualStudioAaxIDEProjectFilePath(),
            context.getVisualStudioAppIDEProjectFiltersFilePath(),
            context.getVisualStudioVst2IDEProjectFiltersFilePath(),
            context.getVisualStudioVst3IDEProjectFiltersFilePath(),
            context.getVisualStudioAaxIDEProjectFiltersFilePath()
        ];
    }



}
