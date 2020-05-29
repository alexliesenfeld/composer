import { PluginFormat, WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { WorkspacePaths } from '@/renderer/app/services/domain/common/paths';
import { IdeService } from '@/renderer/app/services/domain/ide/ide-service';

export class XcodeIdeService implements IdeService {

    async addFontFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void> {}

    async addImageFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void> {}

    async addUserSourceFilesToIDEProject(paths: WorkspacePaths): Promise<void> {}

    async getIPlug2DependencyFileNames(): Promise<string[]> {
        return [];
    }

    getIdeName(): string {
        return 'XCode';
    }

    async reconfigureFileFilters(paths: WorkspacePaths): Promise<void> {}

    async removeDefaultPrototypeFontFilesFromIDEProject(context: WorkspacePaths): Promise<void> {}

    async removeDefaultPrototypeSourceFilesFromIDEProject(
        context: WorkspacePaths,
        defaultPrototypeSourceFiles: string[],
    ): Promise<void> {}

    async removeFormatFromIdeProject(
        paths: WorkspacePaths,
        format: PluginFormat,
        config: WorkspaceConfig,
    ): Promise<void> {}

    async startIDEProject(context: WorkspacePaths): Promise<void> {}
}
