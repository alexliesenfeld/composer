import { ElectronContext } from '@/renderer/app/model/electron-context';
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
    public async openWorkspaceFromDialog(): Promise<void> {
        const result = await ElectronContext.showOpenDialog({
            filters: [{ extensions: ['json'], name: 'composer.json' }],
            properties: ['createDirectory', 'dontAddToRecent', 'openFile', 'promptToCreate'],
        });

        if (result.canceled) {
            return;
        }

        await this.loadWorkspaceConfigFromPath(result.filePaths[0]);
    }

    @action.bound
    @withLoadingScreen('Loading project')
    @withNotification({
        onError: 'Failed load recently used project',
    })
    public async openWorkspaceFromPath(path: string): Promise<void> {
        await this.loadWorkspaceConfigFromPath(path);
    }

    @action.bound
    @withNotification({ onError: 'Failed saving project' })
    public async save(): Promise<void> {
        if (!this.configPath) {
            // Happens when no project has been loaded but the user already pressed
            // a global keyboard shortcut to save the project.
            return;
        }

        await this.configService.writeWorkspaceConfigToPath(
            this.configPath!,
            this.workspaceConfig!,
        );

        showSuccessNotification('Saved');
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

        await this.configService.writeWorkspaceConfigToPath(projectPath, config);
        await this.loadWorkspaceConfigFromPath(projectPath);

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

        await this.configService.writeWorkspaceConfigToPath(
            this.configPath!,
            this.workspaceConfig!,
        );

        await this.workspaceService.startIDE(this.workspaceConfig!, this.workspacePaths);
    }

    @action.bound
    public deregisterRecentlyOpenedWorkspace(filePath: string): void {
        this.recentlyOpenedWorkspaces = LocalStorageAdapter.deregisterRecentlyOpenedWorkspace(
            filePath,
        );
    }

    @action.bound
    @withNotification({ onError: 'Failed to open project directory' })
    public openProjectDirectoryInFileExplorer() {
        ElectronContext.openDirectoryInOsExplorer(path.dirname(this.configPath!));
    }

    public getResourceAliasName(filePath: string): string {
        return this.workspaceService.getVariableNameForFile(filePath);
    }

    private async loadWorkspaceConfigFromPath(configPath: string): Promise<void> {
        const userConfig = await this.configService.loadConfigFromPath(configPath);
        runInAction(() => {
            this.workspaceConfig = userConfig;
            this.configPath = configPath;
            this.recentlyOpenedWorkspaces = LocalStorageAdapter.registerRecentlyOpenedWorkspace(
                userConfig.projectName,
                configPath,
            );
        });
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
            // Return the first value from the errors map, for the first key of the errors map only
            return validationErrors.errors.entries().next().value[1][0];
        }
    }

    private showValidationError(error: string) {
        showWarningNotification(error);
    }
}
