import { ElectronContext } from '@/renderer/app/model/electron-context';
import { ProjectPaths } from '@/renderer/app/services/domain/common/paths';
import { FilesService } from '@/renderer/app/services/domain/files-service';
import { FileWatcher } from '@/renderer/app/util/file-watcher';
import { action, observable, runInAction } from 'mobx';
import * as path from 'path';

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB,
}

export class FilesStore {
    @observable public activeTab: FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable public sourceFileNamesList: string[] = [];
    @observable public fontFileNamesList: string[] = [];
    @observable public imageFileNamesList: string[] = [];
    @observable public selectedSourceFile: string | undefined;
    @observable public selectedFontFile: string | undefined;
    @observable public selectedImageFile: string | undefined;
    @observable public selectedSourceFileContent: string | undefined;
    @observable public selectedFontFileContent: Buffer | undefined;
    @observable public selectedImageFileContent: string | undefined;
    @observable public fontViewerFontSize = 18;
    @observable public createNewSourceFileDialogOpened = false;
    @observable public sourceFileToDelete: string | undefined;
    @observable public fontFileToDelete: string | undefined;
    @observable public imageFileToDelete: string | undefined;
    @observable public imageInfoPanelOpened = false;
    @observable public fontInfoPanelOpened = false;
    private sourceFilesWatcher: FileWatcher | undefined;
    private fontFilesWatcher: FileWatcher | undefined;
    private imageFilesWatcher: FileWatcher | undefined;

    constructor(private readonly filesService: FilesService) {}

    @action.bound
    public async refreshSourceFilesList(projectPaths: ProjectPaths): Promise<void> {
        const paths = await this.filesService.loadSourceFilesList(projectPaths);
        const names = paths.map((filePath) => path.basename(filePath));

        runInAction(() => {
            this.sourceFileNamesList = names;
            if (
                this.selectedSourceFile &&
                !this.sourceFileNamesList.includes(this.selectedSourceFile)
            ) {
                this.selectedSourceFile = undefined;
            }
            if (!this.selectedSourceFile && this.sourceFileNamesList.length > 0) {
                this.selectedSourceFile = this.sourceFileNamesList[0];
            }
        });

        return this.setSelectedSourceFile(projectPaths, this.selectedSourceFile!);
    }

    @action.bound
    public async refreshFontFilesList(projectPaths: ProjectPaths): Promise<void> {
        const paths = await this.filesService.loadFontFileList(projectPaths);
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

        return this.setSelectedFontFile(projectPaths, this.selectedFontFile);
    }

    @action.bound
    public async refreshImageFilesList(projectPaths: ProjectPaths): Promise<void> {
        const paths = await this.filesService.loadImageFilesList(projectPaths);
        const names = paths.map((filePath) => path.basename(filePath));

        runInAction(() => {
            this.imageFileNamesList = names;
            if (
                this.selectedImageFile &&
                !this.imageFileNamesList.includes(this.selectedImageFile)
            ) {
                this.selectedImageFile = undefined;
            }
            if (!this.selectedImageFile && this.imageFileNamesList.length > 0) {
                this.selectedImageFile = this.imageFileNamesList[0];
            }
        });

        return this.setSelectedImageFile(projectPaths, this.selectedImageFile);
    }

    @action.bound
    public async setSelectedFontFile(
        projectPaths: ProjectPaths,
        file: string | undefined,
    ): Promise<void> {
        if (file) {
            const content = await this.filesService.loadFontContent(projectPaths, file);
            runInAction(() => {
                this.selectedFontFile = file;
                this.selectedFontFileContent = content;
            });
        }
    }

    @action.bound
    public async setSelectedSourceFile(
        projectPaths: ProjectPaths,
        file: string | undefined,
    ): Promise<void> {
        if (file) {
            const content = await this.filesService.loadSourceFileContent(projectPaths, file);
            runInAction(() => {
                this.selectedSourceFile = file;
                this.selectedSourceFileContent = content;
            });
        }
    }

    @action.bound
    public async setSelectedImageFile(
        projectPaths: ProjectPaths,
        file: string | undefined,
    ): Promise<void> {
        if (file) {
            const content = await this.filesService.loadImageFileContent(projectPaths, file);
            runInAction(() => {
                this.selectedImageFile = file;
                this.selectedImageFileContent = content;
            });
        }
    }

    @action.bound
    public async createNewSourceFile(projectPaths: ProjectPaths, fileName: string): Promise<void> {
        await this.filesService.addNewSourceFile(projectPaths, fileName);

        return this.refreshSourceFilesList(projectPaths);
    }

    @action.bound
    public async startDeletingSourceFile(fileName: string): Promise<void> {
        this.sourceFileToDelete = fileName;
    }

    @action.bound
    public async cancelDeletingSourceFile(): Promise<void> {
        this.sourceFileToDelete = undefined;
    }

    @action.bound
    public async completeDeletingSourceFile(projectPaths: ProjectPaths): Promise<void> {
        await this.filesService.deleteSourceFile(projectPaths, this.sourceFileToDelete!);
        await this.refreshSourceFilesList(projectPaths);
        runInAction(() => {
            this.sourceFileToDelete = undefined;
        });
    }

    @action.bound
    public async startDeletingFontFile(fileName: string): Promise<void> {
        this.fontFileToDelete = fileName;
    }

    @action.bound
    public async cancelDeletingFontFile(): Promise<void> {
        this.fontFileToDelete = undefined;
    }

    @action.bound
    public async completeDeletingFontFile(projectPaths: ProjectPaths): Promise<void> {
        await this.filesService.deleteFontFile(projectPaths, this.fontFileToDelete!);
        await this.refreshSourceFilesList(projectPaths);
        runInAction(() => {
            this.fontFileToDelete = undefined;
        });
    }

    @action.bound
    public async startDeletingImageFile(fileName: string): Promise<void> {
        this.imageFileToDelete = fileName;
    }

    @action.bound
    public async cancelDeletingImageFile(): Promise<void> {
        this.imageFileToDelete = undefined;
    }

    @action.bound
    public async completeDeletingImageFile(projectPaths: ProjectPaths): Promise<void> {
        await this.filesService.deleteImageFile(projectPaths, this.imageFileToDelete!);
        await this.refreshSourceFilesList(projectPaths);
        runInAction(() => {
            this.imageFileToDelete = undefined;
        });
    }

    @action.bound
    public async importSourceFile(projectPaths: ProjectPaths): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ['multiSelections'],
            filters: [
                {
                    extensions: ['h', 'hpp', 'cpp'],
                    name: 'Source Files (*.h,*.hpp,*.cpp)',
                },
            ],
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.importSourceFiles(projectPaths, dialogResult.filePaths);

        return this.refreshSourceFilesList(projectPaths);
    }

    @action.bound
    public async importFontFile(projectPaths: ProjectPaths): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ['multiSelections'],
            filters: [{ extensions: ['ttf'], name: 'Font Files (*.ttf)' }],
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addFontFiles(projectPaths, dialogResult.filePaths);

        return this.refreshFontFilesList(projectPaths);
    }

    @action.bound
    public async importImage(projectPaths: ProjectPaths): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            properties: ['multiSelections'],
            filters: [{ extensions: ['png'], name: 'Image Files (*.png)' }],
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addImageFiles(projectPaths, dialogResult.filePaths);

        return this.refreshImageFilesList(projectPaths);
    }

    @action.bound
    public async watchSourcesDir(projectPaths: ProjectPaths, onDirChange: () => void) {
        this.unwatchSourcesDir();
        this.sourceFilesWatcher = new FileWatcher(projectPaths.getSourcesDir(), onDirChange);
        await this.sourceFilesWatcher.start();
    }

    @action.bound
    public async unwatchSourcesDir() {
        if (this.sourceFilesWatcher) {
            await this.sourceFilesWatcher.stop();
        }
    }

    @action.bound
    public async watchFontsDir(projectPaths: ProjectPaths, onDirChange: () => void) {
        this.unwatchFontsDir();
        this.fontFilesWatcher = new FileWatcher(projectPaths.getFontsDir(), onDirChange);
        await this.fontFilesWatcher.start();
    }

    @action.bound
    public async unwatchFontsDir() {
        if (this.fontFilesWatcher) {
            await this.fontFilesWatcher.stop();
        }
    }

    @action.bound
    public async watchImageDir(projectPaths: ProjectPaths, onDirChange: () => void) {
        this.unwatchImageDir();
        this.imageFilesWatcher = new FileWatcher(projectPaths.getImagesDir(), onDirChange);
        await this.imageFilesWatcher.start();
    }

    @action.bound
    public async unwatchImageDir() {
        if (this.imageFilesWatcher) {
            await this.imageFilesWatcher.stop();
        }
    }
}
