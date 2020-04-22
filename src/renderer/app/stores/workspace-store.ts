import {action, observable, runInAction} from "mobx";
import {showSuccessToast, withErrorToast} from "@/renderer/app/services/ui/app-toaster";
import {UserConfig} from "@/renderer/app/model/user-config";
import {withLoadingScreen} from "@/renderer/app/services/ui/activity-util";
import * as workspaceService from "@/renderer/app/services/domain/workspace-service";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import * as configService from "@/renderer/app/services/domain/config-service";
import {Fs} from "@/renderer/app/util/fs";

export class WorkspaceStore {
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;
    @observable sourceFilesList: string[] = [];

    @action.bound
    public async refreshSourceFilesList(): Promise<void> {
        const appPath = ElectronContext.remote.app.getAppPath();
        const sourceFilesList = await Fs.readdir(appPath);
        runInAction(() => {
            this.sourceFilesList = sourceFilesList;
        })
    }

    @action.bound
    @withErrorToast("Failed creating a new project")
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

        showSuccessToast("Successfully created a new project")
    }

    @action.bound
    @withErrorToast("Failed to open project")
    public async openConfigFromDialog(): Promise<void> {
        const result = await ElectronContext.dialog.showOpenDialog({
            filters: [{extensions: ["json"], name: 'composer.json'}]
        });

        if (result.canceled) {
            return;
        }

        await this.loadConfigFromPath(result.filePaths[0]);
        showSuccessToast("Successfully opened project")
    }

    @action.bound
    @withErrorToast("Failed saving project")
    public async save(): Promise<void> {
        await configService.writeConfigToPath(this.configPath!, this.userConfig!);
        showSuccessToast("Saved")
    }

    @action.bound
    @withLoadingScreen("Setting up workspace ...")
    @withErrorToast("Failed to setup workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig) {
        await workspaceService.setupWorkspace(userConfigFilePath, config);
        showSuccessToast("Successfully created workspace")
    }

    private async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await configService.loadConfigFromPath(path);

        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = path;
        });

        ElectronContext.enableSaveItemInWindowMenu(true);
    }
}
