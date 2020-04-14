import { AppStore } from "./appStore";
import {ProjectStore} from "@/renderer/app/stores/projectStore";
import {FilesStore} from "@/renderer/app/stores/filesStore";
import {ConfigStore} from "@/renderer/app/stores/configStore";

export const stores = {
    appStore: new AppStore(),
    projectStore: new ProjectStore(),
    filesStore: new FilesStore(),
    configStore: new ConfigStore()
};

