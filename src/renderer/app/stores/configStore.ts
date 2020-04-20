import {action, observable, runInAction} from "mobx";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {UserConfig} from "@/renderer/app/model/user-config";
import * as configController from "../controllers/config";

export class ConfigStore {
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;

    @action.bound
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

        await configController.writeNewConfigToPath(result.filePath);
        this.loadConfigFromPath(result.filePath);
    }

    @action.bound
    public async openConfigFromDialog(): Promise<void> {
        const result = await ElectronContext.dialog.showOpenDialog({
            filters: [{extensions: ["json"], name: 'composer.json'}]
        });

        if (result.canceled) {
            return;
        }

        this.loadConfigFromPath(result.filePaths[0]);
    }

    @action.bound
    public async save(): Promise<void> {
        await configController.writeConfigToPath(this.configPath!, this.userConfig!);
    }

    @action.bound
    public async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await configController.loadConfigFromPath(path);

        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = path;
        });

        ElectronContext.enableSaveItemInWindowMenu(true);
    }

}
