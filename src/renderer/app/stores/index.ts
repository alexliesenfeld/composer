import {AppStore} from "@/renderer/app/stores/app-store";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore} from "@/renderer/app/stores/files-store";
import {FilesService} from "@/renderer/app/services/domain/files-service";
import {WorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {VisualStudioIdeService} from "@/renderer/app/services/domain/ide/visual-studio-ide-service";
import {XcodeIdeService} from "@/renderer/app/services/domain/ide/xcode-ide-service";
import {OperatingSystem} from "@/renderer/app/services/domain/common/model";

const filesService = new FilesService();
const ideService = ElectronContext.currentOperatingSystem() == OperatingSystem.WINDOWS ?
    new VisualStudioIdeService(filesService) : new XcodeIdeService();
const workspaceService = new WorkspaceService(ideService);

export const stores = {
    appStore: new AppStore(workspaceService.getIdeName()),
    workspaceStore: new WorkspaceStore(workspaceService),
    filesStore: new FilesStore(filesService)
};

