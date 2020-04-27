import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {Fsx} from "@/renderer/app/util/fsx";
import {getProjectDir, getSourcesDir, getSourcesDirFromConfigPath} from "@/renderer/app/services/domain/common";
import {copyFile, createDirIfNotExists, directoryDoesNotExistOrIsEmpty} from "@/renderer/app/util/file-utils";
import * as path from "path";

export class FilesService {

    @logActivity("Reading source files")
    async loadFiles(userConfigFilePath: string): Promise<string[]> {
        const sourcesDir = getSourcesDirFromConfigPath(userConfigFilePath);
        if (await directoryDoesNotExistOrIsEmpty(sourcesDir)) {
            return [];
        }
        return Fsx.readdir(sourcesDir);
    };

    @logActivity("Adding file {1} to sources")
    async addNewSourceFile(userConfigFilePath: string, newSourceFilePath: string): Promise<void> {
        const sourcesDir = getSourcesDirFromConfigPath(userConfigFilePath);
        const fileName = path.basename(newSourceFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await createDirIfNotExists(sourcesDir);
        return copyFile(newSourceFilePath, filePath);
    };
}
