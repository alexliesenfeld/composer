import {AppStore} from "@/renderer/app/stores/app-store";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore} from "@/renderer/app/stores/files-store";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {OperatingSystem} from "@/renderer/app/services/domain/common";
import {WindowsWorkspaceService} from "@/renderer/app/services/domain/windows-workspace-service";
import {MacOSWorkspaceService} from "@/renderer/app/services/domain/macos-workspace-service";

const filesService = new FilesService();
const workspaceService = ElectronContext.currentOperatingSystem() == OperatingSystem.WINDOWS ?
    new WindowsWorkspaceService(filesService) : new MacOSWorkspaceService(filesService);

export const stores = {
    appStore: new AppStore(),
    workspaceStore: new WorkspaceStore(workspaceService),
    filesStore: new FilesStore(filesService)
};

