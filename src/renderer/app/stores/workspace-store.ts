import { ElectronContext } from '@/renderer/app/model/electron-context';
import { SavingError } from '@/renderer/app/model/errors';
import { IPlugPluginType, WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { WorkspacePaths } from '@/renderer/app/services/domain/common/paths';
import { ConfigService } from '@/renderer/app/services/domain/config-service';
import { WorkspaceService } from '@/renderer/app/services/domain/workspace-service';
import { withLoadingScreen } from '@/renderer/app/services/ui/loading-screen-service';
import { LocalStorageAdapter } from '@/renderer/app/services/ui/local-storagea-dapter';
import {
    showSuccessNotification,
    showWarningNotification,
    withNotification,
} from '@/renderer/app/services/ui/notification-service';
import { WorkspaceMetadata } from '@/renderer/app/stores/app-store';
import { Fsx } from '@/renderer/app/util/fsx';
import { action, computed, observable, runInAction } from 'mobx';
import * as path from 'path';

export class WorkspaceStore {
    @observable public workspaceConfig: WorkspaceConfig | undefined = undefined;
    @observable public configPath: string | undefined = undefined;
    @observable public recentlyOpenedWorkspaces: WorkspaceMetadata[];

    constructor(private workspaceService: WorkspaceService, private configService: ConfigService) {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.readRecentlyOpenedWorkspaces();
    }

    @computed({ keepAlive: true }) get workspacePaths() {
        return new WorkspacePaths(this.configPath!, this.workspaceConfig!);
    }

    @action.bound
    @withNotification({ onError: 'Failed to open project' })
    public async openConfigFromDialog(): Promise<void> {
        const result = await ElectronContext.dialog.showOpenDialog({
            filters: [{ extensions: ['json'], name: 'composer.json' }],
            properties: ['createDirectory', 'dontAddToRecent', 'openDirectory', 'promptToCreate'],
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

        await this.configService.writeConfigToPath(this.configPath!, this.workspaceConfig!);
    }

    @action.bound
    @withNotification({ onError: 'Failed creating a new project' })
    @withLoadingScreen('Initializing Workspace')
    public async initializeWorkspace(
        projectName: string,
        pluginType: IPlugPluginType,
        projectDir: string,
    ): Promise<void> {
        const config = {
            ...this.configService.createDefaultConfig(),
            pluginType,
            projectName,
            mainClassName: projectName,
        };

        const validationError =
            (await this.validateConfig(config)) ||
            (await this.validateProjectDirectory(projectDir));
        if (validationError) {
            this.showValidationError(validationError);
            return;
        }

        const projectPath = path.join(projectDir, 'composer.json');

        await this.configService.writeConfigToPath(projectPath, config);
        await this.loadConfigFromPath(projectPath);

        await this.workspaceService.setupWorkspace(config, this.workspacePaths, true);

        showSuccessNotification('Successfully created a new project');
    }

    @action.bound
    @withLoadingScreen('Starting IDE')
    @withNotification({ onError: 'Failed to start IDE' })
    public async startIDE() {
        const validationError = await this.validateConfig(this.workspaceConfig!);
        if (validationError) {
            this.showValidationError(validationError);
            return;
        }

        await this.configService.writeConfigToPath(this.configPath!, this.workspaceConfig!);
        await this.workspaceService.startIDE(this.workspaceConfig!, this.workspacePaths);
    }

    @action.bound
    @withLoadingScreen('Loading project')
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
        const userConfig = await this.configService.loadConfigFromPath(configPath);
        this.setConfig(configPath, userConfig);
        this.registerRecentlyOpenedWorkspace(userConfig.projectName, configPath);
    }

    private setConfig(configPath: string, userConfig: WorkspaceConfig) {
        runInAction(() => {
            this.workspaceConfig = userConfig;
            this.configPath = configPath;
        });
    }

    private registerRecentlyOpenedWorkspace(projectName: string, filePath: string): void {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.registerRecentlyOpenedWorkspace(
            projectName,
            filePath,
        );
    }

    private async validateProjectDirectory(projectDir: string): Promise<string | void> {
        if (!projectDir) {
            return 'Please select a project directory';
        }

        const filesInDirectory = await Fsx.readdir(projectDir);
        if (filesInDirectory && filesInDirectory.length > 0) {
            return 'The directory of a new project must be empty';
        }
    }

    private async validateConfig(config: WorkspaceConfig): Promise<string | void> {
        const validationErrors = await this.configService.validate(config);
        if (validationErrors.hasErrors()) {
            // Return the first value from the errors array for the first key of the errors map
            return validationErrors.errors.entries().next().value[1][0];
        }
    }

    private showValidationError(error: string) {
        showWarningNotification(error);
    }
}
