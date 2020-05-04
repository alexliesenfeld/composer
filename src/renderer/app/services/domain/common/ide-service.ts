import {WorkspacePaths} from "@/renderer/app/services/domain/common/paths";

export type VariableNameTranslator = (filePath: string) => string;

export interface IdeService {
    getIdeName(): string;
    initializeFontFilesInIDEProject(context: WorkspacePaths, translate: VariableNameTranslator): Promise<void>;
    removeDefaultPrototypeFontFilesFromIDEProject(context: WorkspacePaths): Promise<void>;
    removeDefaultPrototypeSourceFiles(context: WorkspacePaths, defaultPrototypeSourceFiles: string[]): Promise<void>;
    addUserSourceFilesToIDEProject(context: WorkspacePaths): Promise<void>;
    addUserFontFilesToIDEProject(context: WorkspacePaths, translateToVariable: VariableNameTranslator): Promise<void>;
    startIDEProject(context: WorkspacePaths): Promise<void>;
    getIPlug2DependencyFileNames(): Promise<string[]>;
}
