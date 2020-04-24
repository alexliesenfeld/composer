import {action, observable, runInAction} from "mobx";
import {showSuccessToast, withToast} from "@/renderer/app/services/ui/app-toaster";
import {UserConfig} from "@/renderer/app/model/user-config";
import {withLoadingScreen} from "@/renderer/app/services/ui/activity-util";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import * as configService from "@/renderer/app/services/domain/config-service";
import {WorkspaceService} from "@/renderer/app/services/domain/workspace-service";
import {Fsx} from "@/renderer/app/util/fsx";

export class WorkspaceStore {
    private readonly workspaceService = new WorkspaceService();
    @observable userConfig: UserConfig | undefined = undefined;
    @observable configPath: string | undefined = undefined;
    @observable sourceFilesList: string[] = [];

    @action.bound
    public async refreshSourceFilesList(): Promise<void> {
        const appPath = ElectronContext.remote.app.getAppPath();
        const sourceFilesList = await Fsx.readdir(appPath);
        runInAction(() => {
            this.sourceFilesList = sourceFilesList;
        })
    }

    @action.bound
    @withToast("Failed creating a new project")
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
    @withToast("Failed to open project")
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
    @withToast("Failed saving project", "Saved")
    public async save(): Promise<void> {
        await configService.writeConfigToPath(this.configPath!, this.userConfig!);
    }

    @action.bound
    @withLoadingScreen("Starting ...")
    @withToast("Failed to setup workspace", "Successfully created workspace")
    async startIde(userConfigFilePath: string, config: UserConfig) {
        await this.workspaceService.setupWorkspace(userConfigFilePath, config, ElectronContext.currentOperatingSystem());
    }

    @action.bound
    public async setProjectName(projectName: string): Promise<void> {
        this.userConfig!.projectName = projectName;
        ElectronContext.setCurrentProjectName(projectName);
    }

    private async loadConfigFromPath(path: string): Promise<void> {
        const userConfig = await configService.loadConfigFromPath(path);

        runInAction(() => {
            this.userConfig = userConfig;
            this.configPath = path;
        });

        ElectronContext.enableSaveItemInWindowMenu(true);
        ElectronContext.setCurrentProjectName(this.userConfig!.projectName);
    }
}
