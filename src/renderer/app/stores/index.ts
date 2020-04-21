import {FilesStore} from "@/renderer/app/stores/filesStore";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {AppStore} from "@/renderer/app/stores/appStore";
import {WorkspaceStore} from "@/renderer/app/stores/workspaceStore";

export const stores = {
    filesStore: new FilesStore(),
    configStore: new ConfigStore(),
    appStore: new AppStore(),
    workspaceStore: new WorkspaceStore()
};

