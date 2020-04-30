import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import * as path from "path";

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB
}

export class FilesStore {
    @observable activeTab: FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable sourceFileNamesList: string[] = [];
    @observable fontFileNamesList: string[] = [];
    @observable imageFileNamesList: string[] = [];
    @observable selectedSourceFile: string | undefined;
    @observable selectedFontFile: string | undefined;
    @observable selectedImageFile: string | undefined;
    @observable selectedSourceFileContent: string | undefined;
    @observable selectedFontFileContent: Buffer | undefined;
    @observable fontViewerFontSize = 18;

    constructor(private readonly filesService: FilesService) {
    }

    @action.bound
    public async refreshSourceFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadSourceFilesList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));
        runInAction(() => {
            this.sourceFileNamesList = names;
        })
    }

    @action.bound
    public async refreshFontFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadFontFileList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));
        runInAction(() => {
            this.fontFileNamesList = names;
        })
    }

    @action.bound
    public async refreshImageFilesList(userConfigFilePath: string): Promise<void> {
        const paths = await this.filesService.loadImageFilesList(userConfigFilePath);
        const names = paths.map((filePath) => path.basename(filePath));
        runInAction(() => {
            this.imageFileNamesList = names;
        })
    }

    @action.bound
    public async addNewSourceFile(userConfigFilePath: string): Promise<void> {
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
    public async addNewFontFile(userConfigFilePath: string): Promise<void> {
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
    public async addNewImage(userConfigFilePath: string): Promise<void> {
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
    public loadSourceFileContent(userConfigFilePath: string, file: string) {
        this.selectedSourceFileContent = this.filesService.loadSourceFileContentSync(userConfigFilePath, file);
    }

    @action.bound
    public loadFontContent(userConfigFilePath: string, file: string) {
        this.selectedFontFileContent = this.filesService.loadFontContentSync(userConfigFilePath, file);
    }
}
