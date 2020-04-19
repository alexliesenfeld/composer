import {action, observable} from "mobx";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";
import {PluginFormat, Prototype, UserConfig} from "@/lib/model/user-config";
import * as userConfigHandlers from "@/lib/handlers/user-config"
import {NotInitializedError} from "@/lib/model/errors";

export class ConfigStore {
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;

    @action.bound
    public setUserConfig(config: UserConfig): void {
        this.userConfig = config;
    }

    @action.bound
    public setProjectName(config: string): void {
        this.userConfig!.projectName = config;
    }

    @action.bound
    public setUiWidth(v: number): void {
        this.userConfig!.uiWidth = v;
    }

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

        this.writeConfigToPath(result.filePath, {
            projectName: 'New Project',
            prototype: Prototype.IPLIGEFFECT,
            uiEnabled: true,
            fps: 60,
            formats: [PluginFormat.AU2, PluginFormat.VST3],
            uiHeight: 600,
            uiWidth: 600,
            pluginVersion: '0.0.0',
        } as UserConfig);
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
        if (!this.userConfig || !this.configPath) {
            throw new NotInitializedError("No config was loaded yet");
        }

        await this.writeConfigToPath(this.configPath, this.userConfig);
    }

    @action.bound
    public async writeConfigToPath(path: string, config: UserConfig): Promise<void> {
        await userConfigHandlers.writeConfigToPath(path, config);
    }

    @action.bound
    public async loadConfigFromPath(path: string): Promise<void> {
        this.userConfig = await userConfigHandlers.loadConfigFromPath(path);
        this.configPath = path;
        ElectronContext.enableSaveItemInWindowMenu(true);
    }

}
