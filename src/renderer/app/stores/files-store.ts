import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import * as path from "path";
import {FileWatcher} from "@/renderer/app/util/file-watcher";

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB
}

export class FilesStore {
    private sourceFilesWatcher: FileWatcher | undefined;
    private fontFilesWatcher: FileWatcher | undefined;
    private imageFilesWatcher: FileWatcher | undefined;
    @observable activeTab: FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable sourceFileNamesList: string[] = [];
    @observable fontFileNamesList: string[] = [];
    @observable imageFileNamesList: string[] = [];
    @observable selectedSourceFile: string | undefined;
    @observable selectedFontFile: string | undefined;
    @observable selectedImageFile: string | undefined;
    @observable selectedSourceFileContent: string | undefined;
    @observable selectedFontFileContent: Buffer | undefined;
    @observable selectedImageFileContent: string | undefined;
    @observable fontViewerFontSize = 18;
    @observable imageViewerStretchImage = false;

    constructor(private readonly filesService: FilesService) {
    }

    @action.bound
    async refreshSourceFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadSourceFilesList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));

        runInAction(() => {
            this.sourceFileNamesList = names;
            if (this.selectedSourceFile && !this.sourceFileNamesList.includes(this.selectedSourceFile)) {
                this.selectedSourceFile = undefined;
            }
            if (!this.selectedSourceFile && this.sourceFileNamesList.length > 0) {
                this.selectedSourceFile = this.sourceFileNamesList[0];
            }
        });

       return this.setSelectedSourceFile(userConfigFilePath, this.selectedSourceFile!);
    }

    @action.bound
    async refreshFontFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadFontFileList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));

        runInAction(() => {
            this.fontFileNamesList = names;
            if (this.selectedFontFile && !this.fontFileNamesList.includes(this.selectedFontFile)) {
                this.selectedFontFile = undefined;
            }
            if (!this.selectedFontFile && this.fontFileNamesList.length > 0) {
                this.selectedFontFile = this.fontFileNamesList[0];
            }
        });

        return this.setSelectedFontFile(userConfigFilePath, this.selectedFontFile);
    }

    @action.bound
    async refreshImageFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadImageFilesList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));

        runInAction(() => {
            this.imageFileNamesList = names;
            if (this.selectedImageFile && !this.imageFileNamesList.includes(this.selectedImageFile)) {
                this.selectedImageFile = undefined;
            }
            if (!this.selectedImageFile && this.imageFileNamesList.length > 0) {
                this.selectedImageFile = this.imageFileNamesList[0];
            }
        });

        return this.setSelectedImageFile(userConfigFilePath, this.selectedImageFile);
    }

    @action.bound
    async setSelectedFontFile(userConfigFilePath: string, file: string | undefined): Promise<void> {
        if (file) {
            const content = await this.filesService.loadFontContent(userConfigFilePath, file);
            runInAction(() => {
                this.selectedFontFile = file;
                this.selectedFontFileContent = content
            });
        }
    }

    @action.bound
    async setSelectedSourceFile(userConfigFilePath: string, file: string | undefined): Promise<void> {
        if (file) {
            const content = await this.filesService.loadSourceFileContent(userConfigFilePath, file);
            runInAction(() => {
                this.selectedSourceFile = file;
                this.selectedSourceFileContent = content
            });
        }
    }

    @action.bound
    async setSelectedImageFile(userConfigFilePath: string, file: string | undefined): Promise<void> {
        if (file) {
            const content = await this.filesService.loadImageFileContent(userConfigFilePath, file);
            runInAction(() => {
                this.selectedImageFile = file;
                this.selectedImageFileContent = content
            });
        }
    }

    @action.bound
    async addNewSourceFile(userConfigFilePath: string): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ["multiSelections"],
            filters: [{extensions: ["h", "hpp", "cpp"], name: 'Source Files (*.h,*.hpp,*.cpp)'}]
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addSourceFiles(userConfigFilePath, dialogResult.filePaths);
        return this.refreshSourceFilesList(userConfigFilePath);
    }

    @action.bound
    async addNewFontFile(userConfigFilePath: string): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ["multiSelections"],
            filters: [{extensions: ["ttf"], name: 'Font Files (*.ttf)'}]
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addFontFiles(userConfigFilePath, dialogResult.filePaths);
        return this.refreshFontFilesList(userConfigFilePath);
    }

    @action.bound
    async addNewImage(userConfigFilePath: string): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ["multiSelections"],
            filters: [{extensions: ["png", "bmp", "svg"], name: 'Image Files (*.png,*.bmp,*.svg)'}]
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addImageFiles(userConfigFilePath, dialogResult.filePaths);
        return this.refreshImageFilesList(userConfigFilePath);
    }

    @action.bound
    async watchSourcesDir(userConfigFilePath: string, onDirChange: () => void) {
        this.unwatchSourcesDir();
        const dir = this.filesService.getSourcesDir(userConfigFilePath);
        this.sourceFilesWatcher = new FileWatcher(dir, onDirChange);
        await this.sourceFilesWatcher.start();
    }

    @action.bound
    async unwatchSourcesDir() {
        if (this.sourceFilesWatcher) {
            await this.sourceFilesWatcher.stop();
        }
    }

    @action.bound
    async watchFontsDir(userConfigFilePath: string, onDirChange: () => void) {
        this.unwatchFontsDir();
        const dir = this.filesService.getFontsDir(userConfigFilePath);
        this.fontFilesWatcher = new FileWatcher(dir, onDirChange);
        await this.fontFilesWatcher.start();
    }

    @action.bound
    async unwatchFontsDir() {
        if (this.fontFilesWatcher) {
            await this.fontFilesWatcher.stop();
        }
    }

    @action.bound
    async watchImageDir(userConfigFilePath: string, onDirChange: () => void) {
        this.unwatchImageDir();
        const dir = this.filesService.getImagesDir(userConfigFilePath);
        this.imageFilesWatcher = new FileWatcher(dir, onDirChange);
        await this.imageFilesWatcher.start();
    }

    @action.bound
    async unwatchImageDir() {
        if (this.imageFilesWatcher) {
            await this.imageFilesWatcher.stop();
        }
    }
}
