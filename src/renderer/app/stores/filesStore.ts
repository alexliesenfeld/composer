import {action, observable} from "mobx";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";
import {Fs} from "@/lib/helpers/fs";
import {FileNotFoundError} from "@/lib/model/errors";

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
        this.sourceFilesList = await Fs.readdir(appPath);
    }

    @action.bound
    public setActiveTab(tab: FilesTab): void {
        this.activeTab = tab;
    }
}
