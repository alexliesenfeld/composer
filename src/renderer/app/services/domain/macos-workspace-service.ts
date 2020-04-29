import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";
import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {AbstractWorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {FilesService} from "@/renderer/app/services/domain/files-service";

export class MacOSWorkspaceService extends AbstractWorkspaceService {

    public constructor(fileService: FilesService) {
        super(fileService);
    }

    async getIPlug2DependencyFileNames(): Promise<string[]> {
        throw new UnsupportedOperationError("Not implemented");
    }

    @logActivity("Starting Visual Studio project")
    async startIDEProject(workspaceDirPath: string, config: WorkspaceConfig): Promise<void> {
        throw new UnsupportedOperationError("Not implemented");
    }

    @logActivity("Adding source files")
    async addSourceFilesToIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        throw new UnsupportedOperationError("Not implemented");
    }

    @logActivity("Cleaning project from prototype files")
    async removeGeneratedPrototypeSourceFilesFromIDEProject(composerFilePath: string, config: WorkspaceConfig): Promise<void> {
        throw new UnsupportedOperationError("Not implemented");
    }

}
