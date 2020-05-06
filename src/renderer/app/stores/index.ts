import { ElectronContext } from '@/renderer/app/model/electron-context';
import { OperatingSystem } from '@/renderer/app/services/domain/common/model';
import { FilesService } from '@/renderer/app/services/domain/files-service';
import { VisualStudioIdeService } from '@/renderer/app/services/domain/ide/visual-studio-ide-service';
import { WorkspaceService } from '@/renderer/app/services/domain/workspace-service';
import { AppStore } from '@/renderer/app/stores/app-store';
import { FilesStore } from '@/renderer/app/stores/files-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';

const filesService = new FilesService();
const ideService =
    ElectronContext.currentOperatingSystem() == OperatingSystem.WINDOWS
        ? new VisualStudioIdeService(filesService)
        : null; /*new XcodeIdeService()*/
const workspaceService = new WorkspaceService(filesService, ideService!);

export const stores = {
    appStore: new AppStore(workspaceService.getIdeName()),
    workspaceStore: new WorkspaceStore(workspaceService),
    filesStore: new FilesStore(filesService),
};
