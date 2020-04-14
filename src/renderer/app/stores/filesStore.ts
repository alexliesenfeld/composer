import { observable, action, computed } from "mobx";
import {ElectronContext} from "@/renderer/app/support/electron-context";

export enum FilesTab {
    SOURCE_FILES_TAB,
    FONTS_TAB,
    IMAGES_TAB
}

export class FilesStore {
    private electronContext = new ElectronContext();

    @observable activeTab : FilesTab = FilesTab.SOURCE_FILES_TAB;
    @observable sourceFilesList : string[] = [];

    @action.bound
    public async refreshSourceFilesList(): Promise<void> {
        const appPath = this.electronContext.remote.app.getAppPath();
        const readdir = this.electronContext.util.promisify(this.electronContext.fs.readdir);
        this.sourceFilesList = await readdir(appPath);
    }

    @action.bound
    public setActiveTab(tab : FilesTab): void {
        this.activeTab = tab;
    }
}
