import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {Fs} from "@/renderer/app/util/fs";
import {FileNotFoundError} from "@/renderer/app/model/errors";

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB
}

export class FilesStore {
    @observable activeTab: FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable sourceFilesList: string[] = [];

    @action.bound
    public async refreshSourceFilesList(): Promise<void> {
        const appPath = ElectronContext.remote.app.getAppPath();
        const sourceFilesList = await Fs.readdir(appPath);
        runInAction(() => {
            this.sourceFilesList = sourceFilesList;
        })
    }

    @action.bound
    public setActiveTab(tab: FilesTab): void {
        this.activeTab = tab;
    }
}
