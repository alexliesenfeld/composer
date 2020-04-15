import {action, observable} from "mobx";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";
import {UserConfig} from "@/lib/model/user-config";
import * as userConfigHandlers from "@/lib/handlers/user-config"
import {NotInitializedError} from "@/lib/model/errors";

export class ConfigStore {
    @observable electronContext: ElectronContext = new ElectronContext();
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;

    @action.bound
    public async createNewUserConfig(): Promise<void> {
        const result = await this.electronContext.dialog.showSaveDialog({
            filters: [{
                name: 'JSON',
                extensions: ['json']
            }],
            defaultPath: 'composer.json'
        });

        if (result.canceled || !result.filePath) {
            return;
        }

        this.writeConfigToPath(result.filePath, {projectName: 'New Project'});
        this.loadConfigFromPath(result.filePath);
    }

    @action.bound
    public async openConfigFromDialog(): Promise<void> {
        const result = await this.electronContext.dialog.showOpenDialog({
            filters: [{extensions: ["json"], name: 'composer.json'}]
        });

        if (result.canceled) {
            return;
        }

        this.loadConfigFromPath(result.filePaths[0]);
    }

    @action.bound
    public async save(): Promise<void> {
        if (!this.userConfig || !this.configPath) {
            throw new NotInitializedError("No config was loaded yet");
        }

        await this.writeConfigToPath(this.configPath, this.userConfig);
    }

    @action.bound
    public async writeConfigToPath(path: string, config: UserConfig): Promise<void> {
        await userConfigHandlers.writeConfigToPath(this.electronContext, path, config);
    }

    @action.bound
    public async loadConfigFromPath(path: string): Promise<void> {
        this.userConfig = await userConfigHandlers.loadConfigFromPath(this.electronContext, path);
        this.configPath = path;
        this.electronContext.enableSaveItemInWindowMenu(true);
    }

}
