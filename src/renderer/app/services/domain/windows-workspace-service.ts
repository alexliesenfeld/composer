import * as path from "path";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {Cpx} from "@/renderer/app/util/cpx";
import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {
    getVisualStudioAaxIDEProjectFilePath,
    getVisualStudioAaxIDEProjectFiltersFilePath,
    getVisualStudioAppIDEProjectFilePath,
    getVisualStudioAppIDEProjectFiltersFilePath,
    getVisualStudioIDEProjectsDir,
    getVisualStudioSolutionFilePath,
    getVisualStudioVst2IDEProjectFilePath,
    getVisualStudioVst2IDEProjectFiltersFilePath,
    getVisualStudioVst3IDEProjectFilePath,
    getVisualStudioVst3IDEProjectFiltersFilePath,
    getWorkspaceDir
} from "@/renderer/app/services/domain/common";
import {AbstractWorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {AssertionError} from "@/renderer/app/model/errors";
import {readFile, writeFile} from "@/renderer/app/services/domain/config-service";
import {assertReplace, replaceAll} from "@/renderer/app/util/string-utils";

export class WindowsWorkspaceService extends AbstractWorkspaceService {

    constructor(fileService: FilesService) {
        super(fileService);
    }

    async getIPlug2DependencyFileNames(): Promise<string[]> {
        return ["IPLUG2_DEPS_WIN.zip"];
    }

    @logActivity("Starting Visual Studio project")
    async startIDEProject(workspaceDirPath: string, config: WorkspaceConfig): Promise<void> {
        const vsSolutionPath = getVisualStudioSolutionFilePath(workspaceDirPath, config);
        await Cpx.sudoExec(`start ${vsSolutionPath}`);
    }

    @logActivity("Adding source files to Visual Studio solution projects")
    async addSourceFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        const workspaceDir = getWorkspaceDir(composerFilePath);
        const filePaths = await this.filesService.loadSourceFilesList(composerFilePath);

        const projectFiles = await Promise.all([
            getVisualStudioAppIDEProjectFilePath(workspaceDir, config),
            getVisualStudioVst2IDEProjectFilePath(workspaceDir, config),
            getVisualStudioVst3IDEProjectFilePath(workspaceDir, config),
            getVisualStudioAaxIDEProjectFilePath(workspaceDir, config),
            getVisualStudioAppIDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioVst2IDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioVst3IDEProjectFiltersFilePath(workspaceDir, config),
            getVisualStudioAaxIDEProjectFiltersFilePath(workspaceDir, config)
        ]);

        for (const fileToAdd of filePaths) {
            await Promise.all(projectFiles
                .map(projectFile => this.addSourceFileToVisualStudioProjectFile(composerFilePath, config,
                    projectFile, fileToAdd)))
        }
    }

    private async addSourceFileToVisualStudioProjectFile(composerFilePath: string, config: WorkspaceConfig, vsProjectFile: string, fileToAdd: string): Promise<void> {
        const workspaceDir = getWorkspaceDir(composerFilePath);
        const projectDir = getVisualStudioIDEProjectsDir(workspaceDir, config);
        let fileContent = await readFile(vsProjectFile);

        if (!this.projectFileContainsSourceFile(fileContent, projectDir, fileToAdd)) {
            fileContent = this.addSourceFileToProjectFile(fileContent, projectDir, fileToAdd);
        }

        await writeFile(vsProjectFile, fileContent);
    }

    private projectFileContainsSourceFile(vsProjectFileContent: string, projectDir: string, filePath: string) {
        const allRelativeFilePaths = [
            path.relative(projectDir, filePath),
            // The path separator is used inconsistently in some prototypes files.
            replaceAll(path.relative(projectDir, filePath), path.sep, "/")
        ];

        for (const relativeFilePath of allRelativeFilePaths) {
            if (vsProjectFileContent.includes(this.getSourceFileInclusionSnippet(relativeFilePath))) {
                return true;
            }
        }

        return false;
    }

    private addSourceFileToProjectFile(vsProjectFileContent: string, projectDir: string, filePath: string): string {
        const snippet = this.getSourceFileInclusionSnippet(path.relative(projectDir, filePath));
        return assertReplace(vsProjectFileContent, `</Project>`, `<ItemGroup>${snippet}</ItemGroup></Project>`);
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
}
