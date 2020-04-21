import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {UserConfig} from "@/renderer/app/model/user-config";
import {withErrorToast, showSuccessToast} from "@/renderer/app/util/app-toaster";
import {ConfigService} from "@/renderer/app/services/config-service";

export class ConfigStore {
    private readonly configService = new ConfigService();
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;

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

        await this.configService.writeNewConfigToPath(result.filePath);
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
        await this.configService.writeConfigToPath(this.configPath!, this.userConfig!);
        showSuccessToast("Saved")
    }

    private async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await this.configService.loadConfigFromPath(path);

        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = path;
        });

        ElectronContext.enableSaveItemInWindowMenu(true);
    }

}

