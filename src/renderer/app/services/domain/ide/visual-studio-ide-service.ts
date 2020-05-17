import { AssertionError } from '@/renderer/app/model/errors';
import { PluginFormat, WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import {
    IdeService,
    VariableNameTranslator,
} from '@/renderer/app/services/domain/ide/ide-service';
import { WorkspacePaths } from '@/renderer/app/services/domain/common/paths';
import { FilesService } from '@/renderer/app/services/domain/files-service';
import { logActivity } from '@/renderer/app/services/ui/logging-service';
import { assertArraySize } from '@/renderer/app/util/assertions';
import { Cpx } from '@/renderer/app/util/cpx';
import {
    assertReplaceContentInFile,
    deleteFileIfExists,
    readFile, writeFile
} from '@/renderer/app/util/file-utils';
import {
    assertReplace,
    assertReplaceRegex,
    multiline,
    replace,
    replaceAll,
} from '@/renderer/app/util/string-utils';
import * as path from 'path';
import { EOL } from 'ts-loader/dist/constants';

const MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER = '//MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER';
const MAIN_RC_RESOURCES_PLACEHOLDER = '//MAIN_RC_RESOURCES_PLACEHOLDER';

/**
 * This is a service class to work with the workspace on Windows. It extends the base class with OS-specific
 * functionality.
 */
export class VisualStudioIdeService implements IdeService {
    /**
     * The main constructor.
     * @param fileService A file service that allows accessing source files.
     */
    constructor(private fileService: FilesService) {}

    public getIdeName(): string {
        return 'Visual Studio';
    }

    /**
     * Returns the names of all default iPlug dependency files.
     */
    public async getIPlug2DependencyFileNames(): Promise<string[]> {
        return ['IPLUG2_DEPS_WIN.zip'];
    }

    @logActivity('Starting Visual Studio project')
    public async startIDEProject(paths: WorkspacePaths): Promise<void> {
        const vsSolutionPath = paths.getVisualStudioSolutionFilePath();
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    public async removeDefaultPrototypeSourceFilesFromIDEProject(
        paths: WorkspacePaths,
        defaultPrototypeFiles: string[],
    ): Promise<void> {
        const projectFiles = [
            ...this.getAllVisualStudioProjectFiles(paths),
            ...this.getAllVisualStudioProjectFilterFiles(paths),
        ];

        for (const fileToRemove of defaultPrototypeFiles) {
            await Promise.all(
                projectFiles.map((projectFile) =>
                    this.removeSourceFileFromVisualStudioProjectFile(
                        paths,
                        projectFile,
                        fileToRemove,
                    ),
                ),
            );
            await deleteFileIfExists(fileToRemove);
        }
    }

    public async removeDefaultPrototypeFontFilesFromIDEProject(
        paths: WorkspacePaths,
    ): Promise<void> {
        const mainRcPath = paths.getMainRcPath();

        await assertReplaceContentInFile(
            mainRcPath,
            `"ROBOTO_FN TTF ROBOTO_FN\\0"`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later
            MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER,
        );

        await assertReplaceContentInFile(
            mainRcPath,
            `ROBOTO_FN TTF ROBOTO_FN`,
            // Instead of deleting the old font, we replace it with a placeholder that can be used
            // for insertion later.
            MAIN_RC_RESOURCES_PLACEHOLDER,
        );
    }

    @logActivity('Adding source files to Visual Studio solution projects')
    public async addUserSourceFilesToIDEProject(paths: WorkspacePaths): Promise<void> {
        const projectFiles = this.getAllVisualStudioProjectFiles(paths);
        const projectFilterFiles = this.getAllVisualStudioProjectFilterFiles(paths);

        const filePaths = await this.fileService.loadSourceFilesList(paths);

        for (const fileToAdd of filePaths) {
            await Promise.all(
                projectFiles.map((projectFile) =>
                    this.addSourceFileToVisualStudioProjectFile(paths, projectFile, fileToAdd),
                ),
            );
        }

        for (const fileToAdd of filePaths) {
            await Promise.all(
                projectFilterFiles.map((projectFile) =>
                    this.addSourceFileToVisualStudioProjectFile(paths, projectFile, fileToAdd),
                ),
            );
        }

        await this.addUserSourcesToIncludePath(paths);
    }

    public async initializeFontFilesInIDEProject(
        paths: WorkspacePaths,
        translateToVariable: VariableNameTranslator,
    ): Promise<void> {
        // As fonts have a naming scheme. We are therefore removing the default iPlug name for roboto and re-adding it
        // with the standard naming scheme.
        await assertReplaceContentInFile(
            paths.getMainPluginCppFile(),
            'ROBOTO_FN',
            translateToVariable(`Roboto-Regular.ttf`),
        );
    }

    public async addImageFileToIdeProject(
        paths: WorkspacePaths,
        variableName: string,
    ): Promise<void> {
        const mainRcPath = paths.getMainRcPath();
        let mainRcContent = await readFile(mainRcPath);

        // Adding Resource to section "3 TEXTINCLUDE"
        mainRcContent = assertReplace(
            mainRcContent,
            MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER}${EOL}"${variableName} PNG ${variableName}\\0"${EOL}`,
        );

        // Adding Resource to section "Generated from the TEXTINCLUDE 3 resource."
        mainRcContent = assertReplace(
            mainRcContent,
            MAIN_RC_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_RESOURCES_PLACEHOLDER}${EOL}${variableName} PNG ${variableName}${EOL}`,
        );

        await writeFile(mainRcPath, mainRcContent);
    }

    public async addFontFileToIdeProject(
        paths: WorkspacePaths,
        variableName: string,
    ): Promise<void> {
        const mainRcPath = paths.getMainRcPath();
        let mainRcContent = await readFile(mainRcPath);

        // Adding Resource to section "3 TEXTINCLUDE"
        mainRcContent = assertReplace(
            mainRcContent,
            MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_TEXTINCLUDE_RESOURCES_PLACEHOLDER}${EOL}"${variableName} TTF ${variableName}\\0"${EOL}`,
        );

        // Adding Resource to section "Generated from the TEXTINCLUDE 3 resource."
        mainRcContent = assertReplace(
            mainRcContent,
            MAIN_RC_RESOURCES_PLACEHOLDER,
            `${MAIN_RC_RESOURCES_PLACEHOLDER}${EOL}${variableName} TTF ${variableName}${EOL}`,
        );

        await writeFile(mainRcPath, mainRcContent);
    }

    /**
     * This method creates a new Filter for Visual Studio projects where generated files will be stored.
     * @param paths: Paths for the current project
     */
    public async reconfigureFileFilters(paths: WorkspacePaths): Promise<void> {
        const projectFiles = this.getAllVisualStudioProjectFilterFiles(paths);

        for (const projectFile of projectFiles) {
            let content = await readFile(projectFile);

            // Put all files other than user source files into the "Generated" filter
            content = assertReplaceRegex(
                content,
                /(<Filter>)(.*)(<\/Filter>)/g,
                '$1Generated\\$2$3',
            );

            content = assertReplaceRegex(
                content,
                /(<Filter Include=")(.*)(">)/g,
                '$1Generated\\$2$3',
            );

            // Put config.h into the "Generated" filter as well
            // The foloowing regex matches ../config.h and ..\config.h (slash/backslash)
            content = assertReplaceRegex(
                content,
                /(<ClInclude Include="\.\.)([\/|\\])(config\.h"\s*)(\/>)/g,
                multiline(`$1$2$3>`, `<Filter>Generated</Filter>`, `</ClInclude>`),
            );

            // Create the new "Generated" filter
            content = assertReplace(
                content,
                `</Project>`,
                multiline(
                    `<ItemGroup>`,
                    `<Filter Include="Generated">`,
                    `<UniqueIdentifier>{2fdc99c6-a22e-4fd5-a4e9-e68aedc36c66}</UniqueIdentifier>`,
                    `</Filter>`,
                    `</ItemGroup>`,
                    `</Project>`,
                ),
            );

            await writeFile(projectFile, content);
        }
    }

    public async removeFormatFromIdeProject(
        paths: WorkspacePaths,
        format: PluginFormat,
        config: WorkspaceConfig,
    ): Promise<void> {
        switch (format) {
            case PluginFormat.AAX:
                return this.removeFormatFromSolution(paths, `${config.projectName}-aax`);
            case PluginFormat.APP:
                return this.removeFormatFromSolution(paths, `${config.projectName}-app`);
            case PluginFormat.VST2:
                return this.removeFormatFromSolution(paths, `${config.projectName}-vst2`);
            case PluginFormat.VST3:
                return this.removeFormatFromSolution(paths, `${config.projectName}-vst3`);
            case PluginFormat.AU2:
            case PluginFormat.IOS:
            case PluginFormat.WEB:
                // Do nothing for AU, iOS, and Web
                break;
            default:
        }
    }

    private async removeFormatFromSolution(
        paths: WorkspacePaths,
        formatKey: string,
    ): Promise<void> {
        const solutionPath = paths.getVisualStudioSolutionFilePath();

        const regexLinebreak = '\\n|\\s{2,}';
        const pattern = `^(.*)${formatKey}(.*){(.*)}(.*)(${regexLinebreak})EndProject`;
        const regex = new RegExp(pattern, 'm'); // m = multiline mode

        let content = await readFile(solutionPath);
        const groups = content.match(regex);

        assertArraySize('Solution format groups', groups, 6);

        const formatBuildUuid = groups![3];

        // Remove the actual entry for the format project
        content = assertReplaceRegex(content, regex, '');

        // Remove all builds (Debug, etc.) from the solution.
        content = assertReplaceRegex(content, new RegExp(formatBuildUuid, 'g'), '');

        return writeFile(solutionPath, content);
    }

    private async addSourceFileToVisualStudioProjectFile(
        paths: WorkspacePaths,
        vsProjectFile: string,
        fileToAdd: string,
    ): Promise<void> {
        const projectDir = paths.getVisualStudioIDEProjectsDir();
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
     * @param paths The current workspace paths.
     */
    private async addUserSourcesToIncludePath(paths: WorkspacePaths): Promise<void> {
        const winPropsPath = paths.getVisualStudioProjectWinPropsPath();
        const sourcesDir = paths.getSourcesDir();
        const solutionDir = paths.getProjectBuildDir();

        await assertReplaceContentInFile(
            winPropsPath,
            `</AdditionalIncludeDirectories>`,
            `;$(SolutionDir)${path.relative(
                solutionDir,
                sourcesDir,
            )}</AdditionalIncludeDirectories>`,
        );
    }

    private async removeSourceFileFromVisualStudioProjectFile(
        paths: WorkspacePaths,
        vsProjectFile: string,
        fileToRemove: string,
    ): Promise<void> {
        const projectDir = paths.getVisualStudioIDEProjectsDir();
        let fileContent = await readFile(vsProjectFile);

        if (this.projectFileContainsSourceFile(fileContent, projectDir, fileToRemove)) {
            fileContent = this.removeSourceFileFromProjectFile(
                vsProjectFile,
                fileContent,
                projectDir,
                fileToRemove,
            );
        }

        await writeFile(vsProjectFile, fileContent);
    }

    private projectFileContainsSourceFile(
        vsProjectFileContent: string,
        projectDir: string,
        filePath: string,
    ) {
        const allRelativeFilePaths = this.getPossibleFilePaths(path.relative(projectDir, filePath));

        for (const relativeFilePath of allRelativeFilePaths) {
            if (
                vsProjectFileContent.includes(this.getSourceFileInclusionSnippet(relativeFilePath))
            ) {
                return true;
            }
        }

        return false;
    }

    private getPossibleFilePaths(filePath: string): string[] {
        return [
            filePath,
            // The path separator is used inconsistently in some prototypes files.
            replaceAll(filePath, path.sep, '/'),
        ];
    }

    private addSourceFileToProjectFile(
        vsProjectFileContent: string,
        projectDir: string,
        filePath: string,
    ): string {
        const snippet = this.getSourceFileInclusionSnippet(path.relative(projectDir, filePath));
        return assertReplace(
            vsProjectFileContent,
            `</Project>`,
            `<ItemGroup>${snippet}</ItemGroup></Project>`,
        );
    }

    private removeSourceFileFromProjectFile(
        fileName: string,
        vsProjectFileContent: string,
        projectDir: string,
        filePath: string,
    ): string {
        const possiblePaths = this.getPossibleFilePaths(path.relative(projectDir, filePath));

        for (const relativeFilePath of possiblePaths) {
            const snippet = this.getSourceFileInclusionSnippet(relativeFilePath);
            const result = replace(vsProjectFileContent, snippet, '');
            if (result.success) {
                return result.newContent;
            }
        }

        throw new AssertionError(`Could not remove file ${fileName} from ${vsProjectFileContent}.`);
    }

    private getSourceFileInclusionSnippet(relativeFilePath: string) {
        const ext = path.extname(relativeFilePath);
        switch (ext) {
            case '.h':
            case '.hpp':
                return `<ClInclude Include="${relativeFilePath}" />`;
            case '.cpp':
                return `<ClCompile Include="${relativeFilePath}" />`;
            default:
                throw new AssertionError(`Unsupported file extension '${ext}'`);
        }
    }

    private getAllVisualStudioProjectFiles(paths: WorkspacePaths): string[] {
        return [
            paths.getVisualStudioAppIDEProjectFilePath(),
            paths.getVisualStudioVst2IDEProjectFilePath(),
            paths.getVisualStudioVst3IDEProjectFilePath(),
            paths.getVisualStudioAaxIDEProjectFilePath(),
        ];
    }

    private getAllVisualStudioProjectFilterFiles(paths: WorkspacePaths): string[] {
        return [
            paths.getVisualStudioAppIDEProjectFiltersFilePath(),
            paths.getVisualStudioVst2IDEProjectFiltersFilePath(),
            paths.getVisualStudioVst3IDEProjectFiltersFilePath(),
            paths.getVisualStudioAaxIDEProjectFiltersFilePath(),
        ];
    }
}
