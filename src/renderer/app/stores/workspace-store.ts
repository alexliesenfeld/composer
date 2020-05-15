import { ElectronContext } from '@/renderer/app/model/electron-context';
import { SavingError } from '@/renderer/app/model/errors';
import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { WorkspacePaths } from '@/renderer/app/services/domain/common/paths';
import * as configService from '@/renderer/app/services/domain/config-service';
import { WorkspaceService } from '@/renderer/app/services/domain/workspace-service';
import { withLoadingScreen } from '@/renderer/app/services/ui/loading-screen-service';
import { LocalStorageAdapter } from '@/renderer/app/services/ui/local-storagea-dapter';
import {
    showSuccessNotification,
    withNotification,
} from '@/renderer/app/services/ui/notification-service';
import { WorkspaceMetadata } from '@/renderer/app/stores/app-store';
import { action, observable, runInAction } from 'mobx';
import * as path from 'path';

export class WorkspaceStore {
    @observable public workspaceConfig: WorkspaceConfig | undefined = undefined;
    @observable public configPath: string | undefined = undefined;
    @observable public sourceFilesList: string[] = [];
    @observable public workspacePaths: WorkspacePaths | undefined = undefined;
    @observable public recentlyOpenedWorkspaces: WorkspaceMetadata[];

    constructor(private workspaceService: WorkspaceService) {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.readRecentlyOpenedWorkspaces();
    }

    @action.bound
    @withNotification({ onError: 'Failed creating a new project' })
    public async createNewUserConfig(): Promise<void> {
        const result = await ElectronContext.dialog.showSaveDialog({
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json'],
                },
            ],
            defaultPath: 'composer.json',
        });

        if (result.canceled || !result.filePath) {
            return;
        }

        await configService.writeNewConfigToPath(result.filePath);
        await this.loadConfigFromPath(result.filePath);

        showSuccessNotification('Successfully created a new project');
    }

    @action.bound
    @withNotification({ onError: 'Failed to open project' })
    public async openConfigFromDialog(): Promise<void> {
        const result = await ElectronContext.dialog.showOpenDialog({
            filters: [{ extensions: ['json'], name: 'composer.json' }],
        });

        if (result.canceled) {
            return;
        }

        await this.loadConfigFromPath(result.filePaths[0]);
    }

    @action.bound
    @withNotification({ onError: 'Failed to open project directory' })
    public openProjectDirectoryInFileExplorer() {
        ElectronContext.shell.openItem(path.dirname(this.configPath!));
    }

    @action.bound
    @withNotification({ onError: 'Failed saving project', onSuccess: 'Saved' })
    public async save(): Promise<void> {
        if (!this.configPath) {
            // Happens when no project has been loaded but the user already pressed
            // a global keyboard shortcut to save the project.
            throw new SavingError('No project loaded.');
        }

        await configService.writeConfigToPath(this.configPath!, this.workspaceConfig!);

        runInAction(() => {
            this.registerRecentlyOpenedWorkspace(
                this.workspaceConfig!.projectName,
                this.configPath!,
            );
        });
    }

    @action.bound
    @withLoadingScreen('Starting IDE')
    @withNotification({ onError: 'Failed to start IDE' })
    public async startIDE() {
        await this.workspaceService.startIDE(this.workspaceConfig!, this.workspacePaths!);
    }

    @action.bound
    @withLoadingScreen('Loading recent project')
    @withNotification({
        onError: 'Failed load recently used project',
    })
    public async loadConfigFromPathUi(path: string): Promise<void> {
        await this.loadConfigFromPath(path);
    }

    public getResourceAliasName(filePath: string): string {
        return this.workspaceService.getVariableNameForFile(filePath);
    }

    @action.bound
    public deregisterRecentlyOpenedWorkspace(filePath: string): void {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.deregisterRecentlyOpenedWorkspace(
            filePath,
        );
    }

    private async loadConfigFromPath(configPath: string): Promise<void> {
        const userConfig = await configService.loadConfigFromPath(configPath);
        this.setNewConfig(configPath, userConfig);
        this.registerRecentlyOpenedWorkspace(userConfig.projectName, configPath);
    }

    private setNewConfig(configPath: string, userConfig: WorkspaceConfig) {
        runInAction(() => {
            this.workspaceConfig = userConfig;
            this.configPath = configPath;
            this.workspacePaths = new WorkspacePaths(configPath, userConfig);
        });
    }

    private registerRecentlyOpenedWorkspace(projectName: string, filePath: string): void {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.registerRecentlyOpenedWorkspace(
            projectName,
            filePath,
        );
    }
}
