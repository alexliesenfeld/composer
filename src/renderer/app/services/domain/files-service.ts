import {logActivity} from "@/renderer/app/services/ui/logging-service";
import {Fsx} from "@/renderer/app/util/fsx";
import {
    copyFile,
    createDirIfNotExists,
    deleteFileIfExists,
    directoryDoesNotExistOrIsEmpty
} from "@/renderer/app/util/file-utils";
import * as path from "path";
import {writeFile} from "@/renderer/app/services/domain/config-service";
import {ProjectPaths} from "@/renderer/app/services/domain/common/paths";

export class FilesService {

    async loadSourceFileNamesList(projectPaths: ProjectPaths): Promise<string[]> {
        const result = await this.loadSourceFilesList(projectPaths);
        return result.map(filePath => path.basename(filePath));
    }

    async loadSourceFilesList(projectPaths: ProjectPaths): Promise<string[]> {
        const dir = projectPaths.getSourcesDir();
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadFontFileNamesList(projectPaths: ProjectPaths): Promise<string[]> {
        const result = await this.loadFontFileList(projectPaths);
        return result.map(filePath => path.basename(filePath));
    }

    async loadFontFileList(projectPaths: ProjectPaths): Promise<string[]> {
        const dir = projectPaths.getFontsDir();
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadImageFileNamesList(projectPaths: ProjectPaths): Promise<string[]> {
        const result = await this.loadImageFilesList(projectPaths);
        return result.map(filePath => path.basename(filePath));
    }

    async loadImageFilesList(projectPaths: ProjectPaths): Promise<string[]> {
        const dir = projectPaths.getImagesDir();
        if (await directoryDoesNotExistOrIsEmpty(dir)) {
            return [];
        }
        return (await Fsx.readdir(dir)).map(fileName => path.join(dir, fileName));
    }

    async loadSourceFileContent(projectPaths: ProjectPaths, fileName: string): Promise<string> {
        const dir = projectPaths.getSourcesDir();
        const filePath = path.join(dir, fileName);
        const buffer = await Fsx.readFile(filePath);
        return buffer.toString();
    }

    async loadFontContent(projectPaths: ProjectPaths, fileName: string): Promise<Buffer> {
        const dir = projectPaths.getFontsDir();
        const filePath = path.join(dir, fileName);
        return Fsx.readFile(filePath);
    }

    async loadImageFileContent(projectPaths: ProjectPaths, fileName: string): Promise<string> {
        const dir = projectPaths.getImagesDir();
        const filePath = path.join(dir, fileName);
        const buffer = await Fsx.readFile(filePath);
        return buffer.toString('base64');
    }

    @logActivity("Adding multiple source files")
    async addNewSourceFiles(projectPaths: ProjectPaths, newSourceFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newSourceFilePaths) {
            await this.addNewSourceFile(projectPaths, newSourceFilePath);
        }
    }

    @logActivity("Adding new source file {1}")
    async addNewSourceFile(projectPaths: ProjectPaths, fileName: string): Promise<void> {
        const sourcesDir = projectPaths.getSourcesDir();
        const filePath = path.join(sourcesDir, fileName);

        await createDirIfNotExists(sourcesDir);
        await writeFile(filePath, "");
    }

    @logActivity("Deleting source file {1}")
    async deleteSourceFile(projectPaths: ProjectPaths, fileName: string): Promise<void> {
        const sourcesDir = projectPaths.getSourcesDir();
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

    @logActivity("Importing multiple source files")
    async importSourceFiles(projectPaths: ProjectPaths, newSourceFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newSourceFilePaths) {
            await this.importSourceFile(projectPaths, newSourceFilePath);
        }
    }

    @logActivity("Importing source file {1}")
    async importSourceFile(projectPaths: ProjectPaths, newSourceFilePath: string): Promise<void> {
        const sourcesDir = projectPaths.getSourcesDir();
        const fileName = path.basename(newSourceFilePath);
        const filePath = path.join(sourcesDir, fileName);

        await createDirIfNotExists(sourcesDir);
        await copyFile(newSourceFilePath, filePath);
    }

    @logActivity("Adding multiple font files")
    async addFontFiles(projectPaths: ProjectPaths, newFontFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newFontFilePaths) {
            await this.addFontFile(projectPaths, newSourceFilePath);
        }
    }

    @logActivity("Adding font file {1}")
    async addFontFile(projectPaths: ProjectPaths, newFontFilePath: string): Promise<void> {
        const resourcesDir  = projectPaths.getResourcesDir();
        const fontsDir = projectPaths.getFontsDir();
        const fileName = path.basename(newFontFilePath);
        const filePath = path.join(fontsDir, fileName);

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(fontsDir);

        await copyFile(newFontFilePath, filePath);
    }

    @logActivity("Deleting font file {1}")
    async deleteFontFile(projectPaths: ProjectPaths, fileName: string): Promise<void> {
        const sourcesDir = projectPaths.getFontsDir();
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

    @logActivity("Adding multiple image files")
    async addImageFiles(projectPaths: ProjectPaths, newImageFilePaths: string[]): Promise<void> {
        for (const newSourceFilePath of newImageFilePaths) {
            await this.addImageFile(projectPaths, newSourceFilePath);
        }
    }

    @logActivity("Adding image file {1}")
    async addImageFile(projectPaths: ProjectPaths, newImageFilePath: string): Promise<void> {
        const resourcesDir  = projectPaths.getResourcesDir();
        const imagesDir = projectPaths.getImagesDir();
        const fileName = path.basename(newImageFilePath);
        const filePath = path.join(imagesDir, fileName);

        await createDirIfNotExists(resourcesDir);
        await createDirIfNotExists(imagesDir);

        await copyFile(newImageFilePath, filePath);
    }

    @logActivity("Deleting image file {1}")
    async deleteImageFile(projectPaths: ProjectPaths, fileName: string): Promise<void> {
        const sourcesDir = projectPaths.getImagesDir();
        const filePath = path.join(sourcesDir, fileName);

        await deleteFileIfExists(filePath);
    }

}
