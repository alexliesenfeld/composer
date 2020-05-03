import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {Fsx} from "@/renderer/app/util/fsx";
import {
    getFontsDir,
    getFontsDirFromConfigPath,
    getImagesDir,
    getImagesDirFromConfigPath,
    getResourcesDirFromConfigPath,
    getSourcesDir,
    getSourcesDirFromConfigPath,
    getWorkspaceDir
} from "@/renderer/app/services/domain/common";
import {
    copyFile,
    createDirIfNotExists,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty
} from "@/renderer/app/util/file-utils";
import * as path from "path";
import {writeFile} from "@/renderer/app/services/domain/config-service";

export class FilesService {

    async loadSourceFileNamesList(userConfigFilePath: string): Promise<string[]> {
        const result = await this.loadSourceFilesList(userConfigFilePath);
        return result.map(filePath => path.basename(filePath));
    }

    async loadSourceFilesList(userConfigFilePath: string): Promise<string[]> {
        const dir = getSourcesDirFromConfigPath(userConfigFilePath);
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadFontFileNamesList(userConfigFilePath: string): Promise<string[]> {
        const result = await this.loadFontFileList(userConfigFilePath);
        return result.map(filePath => path.basename(filePath));
    }

    async loadFontFileList(userConfigFilePath: string): Promise<string[]> {
        const dir = getFontsDirFromConfigPath(userConfigFilePath);
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadImageFileNamesList(userConfigFilePath: string): Promise<string[]> {
        const result = await this.loadImageFilesList(userConfigFilePath);
        return result.map(filePath => path.basename(filePath));
    }

    async loadImageFilesList(userConfigFilePath: string): Promise<string[]> {
        const dir = getImagesDirFromConfigPath(userConfigFilePath);
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadSourceFileContent(userConfigFilePath: string, fileName: string): Promise<string> {
        const dir = getSourcesDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(dir, fileName);
        const buffer = await Fsx.readFile(filePath);
        return buffer.toString();
    }

    async loadFontContent(userConfigFilePath: string, fileName: string): Promise<Buffer> {
        const dir = getFontsDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(dir, fileName);
        return Fsx.readFile(filePath);
    }

    async loadImageFileContent(userConfigFilePath: string, fileName: string): Promise<string> {
        const dir = getImagesDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(dir, fileName);
        const buffer = await Fsx.readFile(filePath);
        return buffer.toString('base64');
    }

    @logActivity("Adding multiple source files")
    async addNewSourceFiles(userConfigFilePath: string, newSourceFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newSourceFilePaths) {
            await this.addNewSourceFile(userConfigFilePath, newSourceFilePath);
        }
    }


    @logActivity("Adding new source file {1}")
    async addNewSourceFile(userConfigFilePath: string, fileName: string): Promise<void> {
        const sourcesDir = getSourcesDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await createDirIfNotExists(sourcesDir);
        await writeFile(filePath, "");
    }

    @logActivity("Deleting source file {1}")
    async deleteSourceFile(userConfigFilePath: string, fileName: string): Promise<void> {
        const sourcesDir = getSourcesDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

    @logActivity("Importing multiple source files")
    async importSourceFiles(userConfigFilePath: string, newSourceFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newSourceFilePaths) {
            await this.importSourceFile(userConfigFilePath, newSourceFilePath);
        }
    }

    @logActivity("Importing source file {1}")
    async importSourceFile(userConfigFilePath: string, newSourceFilePath: string): Promise<void> {
        const sourcesDir = getSourcesDirFromConfigPath(userConfigFilePath);
        const fileName = path.basename(newSourceFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await createDirIfNotExists(sourcesDir);
        await copyFile(newSourceFilePath, filePath);
    }

    @logActivity("Adding multiple font files")
    async addFontFiles(userConfigFilePath: string, newFontFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newFontFilePaths) {
            await this.addFontFile(userConfigFilePath, newSourceFilePath);
        }
    }

    @logActivity("Adding font file {1}")
    async addFontFile(userConfigFilePath: string, newFontFilePath: string): Promise<void> {
        const resourcesDir = getResourcesDirFromConfigPath(userConfigFilePath);
        const fontsDir = getFontsDirFromConfigPath(userConfigFilePath);
        const fileName = path.basename(newFontFilePath);
        const filePath = path.join(fontsDir, fileName);

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(fontsDir);

        await copyFile(newFontFilePath, filePath);
    }

    @logActivity("Deleting font file {1}")
    async deleteFontFile(userConfigFilePath: string, fileName: string): Promise<void> {
        const sourcesDir = getFontsDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

    @logActivity("Adding multiple image files")
    async addImageFiles(userConfigFilePath: string, newImageFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newImageFilePaths) {
            await this.addImageFile(userConfigFilePath, newSourceFilePath);
        }
    }

    @logActivity("Adding image file {1}")
    async addImageFile(userConfigFilePath: string, newImageFilePath: string): Promise<void> {
        const resourcesDir = getResourcesDirFromConfigPath(userConfigFilePath);
        const imagesDir = getImagesDirFromConfigPath(userConfigFilePath);
        const fileName = path.basename(newImageFilePath);
        const filePath = path.join(imagesDir, fileName);

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(imagesDir);

        await copyFile(newImageFilePath, filePath);
    }

    @logActivity("Deleting image file {1}")
    async deleteImageFile(userConfigFilePath: string, fileName: string): Promise<void> {
        const sourcesDir = getImagesDirFromConfigPath(userConfigFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

    getSourcesDir(userConfigFilePath: string): string {
        return getSourcesDir(getWorkspaceDir(userConfigFilePath));
    }

    getFontsDir(userConfigFilePath: string): string {
        return getFontsDir(getWorkspaceDir(userConfigFilePath));
    }

    getImagesDir(userConfigFilePath: string): string {
        return getImagesDir(getWorkspaceDir(userConfigFilePath));
    }
}
