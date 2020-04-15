import {action, observable} from "mobx";

export enum ProjectsTab {
    SOURCE_FILES_TAB,
    FONTS_TAB
}

export class ProjectStore {
    @observable activeTab: ProjectsTab = ProjectsTab.SOURCE_FILES_TAB;

    @action.bound
    public setActiveTab(tab: ProjectsTab): void {
        this.activeTab = tab;
    }
}
