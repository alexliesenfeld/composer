import {AppStore} from "@/renderer/app/stores/app-store";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore} from "@/renderer/app/stores/files-store";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {WorkspaceService} from "@/renderer/app/services/domain/workspace-service";

const filesService = new FilesService();
const workspaceService = new WorkspaceService(filesService);

export const stores = {
    appStore: new AppStore(),
    workspaceStore: new WorkspaceStore(workspaceService),
    filesStore: new FilesStore(filesService)
};

