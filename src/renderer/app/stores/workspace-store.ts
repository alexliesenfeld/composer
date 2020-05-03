import {action, computed, observable, runInAction} from "mobx";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import * as configService from "@/renderer/app/services/domain/config-service";
import {withLoadingScreen} from "@/renderer/app/services/ui/loading-screen-service";
import {showSuccessNotification, withNotification} from "@/renderer/app/services/ui/notification-service";
import {trySilently} from "@/renderer/app/util/error-utils";
import {AbstractWorkspaceService} from "@/renderer/app/services/domain/workspace-service";

const CONFIG_PATH_KEY = 'configPath';

export class WorkspaceStore {
    @observable userConfig: WorkspaceConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;
    @observable sourceFilesList: string[] = [];

    constructor(private readonly workspaceService: AbstractWorkspaceService) {
        trySilently(() => this.loadConfigFromPathSync(localStorage.getItem(CONFIG_PATH_KEY)!));
    }

    @action.bound
    @withNotification({onError: "Failed creating a new project"})
    public async createNewUserConfig(): Promise<void> {
        const result = await ElectronContext.dialog.showSaveDialog({
            filters: [{
                name: 'JSON',
                extensions: ['json']
            }],
            defaultPath: 'composer.json'
        });

        if (result.canceled || !result.filePath) {
            return;
        }

        await configService.writeNewConfigToPath(result.filePath);
        await this.loadConfigFromPath(result.filePath);

        showSuccessNotification("Successfully created a new project")
    }

    @action.bound
    @withNotification({onError: "Failed to open project"})
    public async openConfigFromDialog(): Promise<void> {
        const result = await ElectronContext.dialog.showOpenDialog({
            filters: [{extensions: ["json"], name: 'composer.json'}]
        });

        if (result.canceled) {
            return;
        }

        await this.loadConfigFromPath(result.filePaths[0]);
    }

    @action.bound
    @withNotification({onError: "Failed saving project", onSuccess: "Saved"})
    public async save(): Promise<void> {
        await configService.writeConfigToPath(this.configPath!, this.userConfig!);
    }

    @action.bound
    @withLoadingScreen("Starting IDE")
    @withNotification({onError: "Failed to start IDE", showLogButton: true})
    async startIDE(configFilePath: string, config: WorkspaceConfig) {
        await this.workspaceService.startIDE(configFilePath, config);
    }

    getResourceAliasName(filePath: string): string {
        return this.workspaceService.getVariableNameForForFile(filePath);
    }

    private async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await configService.loadConfigFromPath(path);
        this.setNewConfig(path, userConfig);
    }

    private loadConfigFromPathSync(path: string): void {
        const userConfig = configService.loadConfigFromPathSync(path);
        this.setNewConfig(path, userConfig);
    }

    private setNewConfig(configPath: string, userConfig: WorkspaceConfig) {
        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = configPath;
        });

        localStorage.setItem(CONFIG_PATH_KEY, configPath);

        ElectronContext.enableSaveItemInWindowMenu(true);
    }
}
