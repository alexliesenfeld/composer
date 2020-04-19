import {FilesStore} from "@/renderer/app/stores/filesStore";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {AppStore} from "@/renderer/app/stores/appStore";

export const stores = {
    filesStore: new FilesStore(),
    configStore: new ConfigStore(),
    appStore: new AppStore()
};

