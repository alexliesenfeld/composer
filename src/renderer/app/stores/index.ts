import { ElectronContext } from '@/renderer/app/model/electron-context';
import { OperatingSystem } from '@/renderer/app/services/domain/common/model';
import { ConfigService } from '@/renderer/app/services/domain/config-service';
import { FilesService } from '@/renderer/app/services/domain/files-service';
import { VisualStudioIdeService } from '@/renderer/app/services/domain/ide/visual-studio-ide-service';
import { XcodeIdeService } from '@/renderer/app/services/domain/ide/xcode-ide-service';
import { WorkspaceService } from '@/renderer/app/services/domain/workspace-service';
import { AppStore } from '@/renderer/app/stores/app-store';
import { FilesStore } from '@/renderer/app/stores/files-store';
import { SettingsStore } from '@/renderer/app/stores/settings-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { create } from 'mobx-persist';

const configService = new ConfigService();
const filesService = new FilesService();
const ideService =
    ElectronContext.currentOperatingSystem() == OperatingSystem.WINDOWS
        ? new VisualStudioIdeService(filesService)
        : new XcodeIdeService();
const workspaceService = new WorkspaceService(filesService, ideService);

export const stores = {
    appStore: new AppStore(workspaceService.getIdeName()),
    workspaceStore: new WorkspaceStore(workspaceService, configService),
    filesStore: new FilesStore(filesService),
    settingsStore: new SettingsStore(),
};

// Enhance selected stores to persist data
const hydrate = create({
    storage: localStorage,
    jsonify: true,
});

// Enhance all keys of the store so that their values are persisted
Object.keys(stores.settingsStore).map((key) => hydrate(key, stores.settingsStore));
