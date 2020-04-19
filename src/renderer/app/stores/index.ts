import {FilesStore} from "@/renderer/app/stores/filesStore";
import {ConfigStore} from "@/renderer/app/stores/configStore";

export const stores = {
    filesStore: new FilesStore(),
    configStore: new ConfigStore()
};

