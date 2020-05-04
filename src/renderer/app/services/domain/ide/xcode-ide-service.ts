import {IdeService} from "@/renderer/app/services/domain/common/ide-service";
import {WorkspacePaths} from "@/renderer/app/services/domain/common/paths";

export class XcodeIdeService implements IdeService {
    async addUserFontFilesToIDEProject(context: WorkspacePaths, translateToVariable: (filePath: string) => string): Promise<void> {
    }

    async addUserSourceFilesToIDEProject(context: WorkspacePaths): Promise<void> {

    }

    async getIPlug2DependencyFileNames(): Promise<string[]> {
        return []
    }

    getIdeName(): string {
        return "XCode";
    }

    async initializeFontFilesInIDEProject(context: WorkspacePaths, translate: (filePath: string) => string): Promise<void> {

    }

    async removeDefaultPrototypeFontFilesFromIDEProject(context: WorkspacePaths): Promise<void> {

    }

    async removeDefaultPrototypeSourceFiles(context: WorkspacePaths, defaultPrototypeSourceFiles: string[]): Promise<void> {

    }

    async startIDEProject(context: WorkspacePaths): Promise<void> {

    }

}
