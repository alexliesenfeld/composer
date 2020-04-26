import {action, observable, runInAction} from "mobx";
import {UserConfig} from "@/renderer/app/model/user-config";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import * as configService from "@/renderer/app/services/domain/config-service";
import {WorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {Fsx} from "@/renderer/app/util/fsx";
import {withLoadingScreen} from "@/renderer/app/services/ui/loading-screen-service";
import {showSuccessNotification, withNotification} from "@/renderer/app/services/ui/notification-service";
import {trySilently} from "@/renderer/app/util/error-utils";

export class WorkspaceStore {
    private readonly workspaceService = new WorkspaceService();
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;
    @observable sourceFilesList: string[] = [];

    constructor() {
        trySilently(() => this.loadConfigFromPathSync(localStorage.getItem('configPath')!));
    }

    @action.bound
    public async refreshSourceFilesList(): Promise<void> {
        const appPath = ElectronContext.remote.app.getAppPath();
        const sourceFilesList = await Fsx.readdir(appPath);
        runInAction(() => this.sourceFilesList = sourceFilesList);
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
    async startIDE(configFilePath: string, config: UserConfig) {
        await this.workspaceService.startIDE(configFilePath, config, ElectronContext.currentOperatingSystem());
    }

    private async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await configService.loadConfigFromPath(path);
        this.setNewConfig(path, userConfig);
    }

    private loadConfigFromPathSync(path: string): void {
        const userConfig = configService.loadConfigFromPathSync(path);
        this.setNewConfig(path, userConfig);
    }

    private setNewConfig(configPath: string, userConfig: UserConfig) {
        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = configPath;
        });

        localStorage.setItem('configPath', configPath);

        ElectronContext.enableSaveItemInWindowMenu(true);
    }
}
