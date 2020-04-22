import {AppStore} from "@/renderer/app/stores/app-store";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";

export const stores = {
    appStore: new AppStore(),
    workspaceStore: new WorkspaceStore()
};

