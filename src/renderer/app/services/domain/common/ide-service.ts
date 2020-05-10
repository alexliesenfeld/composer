import { WorkspacePaths } from '@/renderer/app/services/domain/common/paths';

export type VariableNameTranslator = (filePath: string) => string;

export interface IdeService {
    getIdeName(): string;

    initializeFontFilesInIDEProject(
        context: WorkspacePaths,
        translate: VariableNameTranslator,
    ): Promise<void>;

    removeDefaultPrototypeFontFilesFromIDEProject(context: WorkspacePaths): Promise<void>;

    removeDefaultPrototypeSourceFilesFromIDEProject(
        context: WorkspacePaths,
        defaultPrototypeSourceFiles: string[],
    ): Promise<void>;

    startIDEProject(context: WorkspacePaths): Promise<void>;

    getIPlug2DependencyFileNames(): Promise<string[]>;

    addImageFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void>;

    addFontFileToIdeProject(paths: WorkspacePaths, variableName: string): Promise<void>;

    addUserSourceFilesToIDEProject(context: WorkspacePaths): Promise<void>;

    reconfigureFileFilters(context: WorkspacePaths): Promise<void>;
}
