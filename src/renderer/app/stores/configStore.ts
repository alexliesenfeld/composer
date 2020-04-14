import {action, observable} from "mobx";
import {ElectronContext} from "@/renderer/app/support/electron-context";
import {UserConfig} from "@/lib/model/user-config";

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
    public async writeConfigToPath(path: string, config: UserConfig): Promise<void> {
        await this.electronContext.promisifiedFs.writeFile(path, JSON.stringify(config));
    }

    @action.bound
    public async loadConfigFromPath(path: string): Promise<void> {
        const fileContent = await this.electronContext.promisifiedFs.readFile(path, {encoding: 'utf-8'});
        this.userConfig = JSON.parse(fileContent);
        this.configPath = path;
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
}
