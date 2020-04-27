import {AppStore} from "@/renderer/app/stores/app-store";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore} from "@/renderer/app/stores/files-store";

export const stores = {
    appStore: new AppStore(),
    workspaceStore: new WorkspaceStore(),
    filesStore: new FilesStore()
};

