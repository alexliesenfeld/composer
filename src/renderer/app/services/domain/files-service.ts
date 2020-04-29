import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {Fsx} from "@/renderer/app/util/fsx";
import {
    getFontsDirFromConfigPath,
    getImagesDirFromConfigPath, getResourcesDir, getResourcesDirFromConfigPath,
    getSourcesDirFromConfigPath
} from "@/renderer/app/services/domain/common";
import {copyFile, createDirIfNotExists, directoryDoesNotExistOrIsEmpty} from "@/renderer/app/util/file-utils";
import * as path from "path";

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

    @logActivity("Adding multiple source files")
    async addSourceFiles(userConfigFilePath: string, newSourceFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newSourceFilePaths) {
            await this.addSourceFile(userConfigFilePath, newSourceFilePath);
        }
    }

    @logActivity("Adding source file {1}")
    async addSourceFile(userConfigFilePath: string, newSourceFilePath: string): Promise<void> {
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


}
