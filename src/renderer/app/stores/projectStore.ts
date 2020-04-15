import { observable, action, computed } from "mobx";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";

export enum ProjectsTab {
    SOURCE_FILES_TAB,
    FONTS_TAB
}

export class ProjectStore {
    private electronContext = new ElectronContext();

    @observable activeTab : ProjectsTab = ProjectsTab.SOURCE_FILES_TAB;

    @action.bound
    public setActiveTab(tab : ProjectsTab): void {
        this.activeTab = tab;
    }
}
