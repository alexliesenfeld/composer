import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {FileNotFoundError} from "@/renderer/app/model/errors";
import {Fsx} from "@/renderer/app/util/fsx";
import {WorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {UserConfig} from "@/renderer/app/model/user-config";

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB
}

export class FilesStore {
    private readonly filesService = new FilesService();
    @observable activeTab: FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable sourceFilesList: string[] = [];

    @action.bound
    public async refreshSourceFilesList(userConfigFilePath: string): Promise<void> {
        const result = await this.filesService.loadFiles(userConfigFilePath);
        runInAction(() => {
            this.sourceFilesList = result;
        })
    }

    @action.bound
    public async addNewSourceFile(userConfigFilePath: string): Promise<void> {
        const dialogResult = await ElectronContext.dialog.showOpenDialog({
            filters: [{extensions: ["h", "hpp", "cpp"], name: 'Source Files'}]
        });

        if (dialogResult.canceled) {
            return;
        }

        await this.filesService.addNewSourceFile(userConfigFilePath, dialogResult.filePaths[0]);
        return this.refreshSourceFilesList(userConfigFilePath);
    }
}
