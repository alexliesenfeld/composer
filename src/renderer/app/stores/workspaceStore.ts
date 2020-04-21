import {action, observable} from "mobx";
import {WorkspaceController} from "@/renderer/app/services/workspace";
import {errorToast} from "@/renderer/app/util/app-toaster";
import {UserConfig} from "@/renderer/app/model/user-config";

export class WorkspaceStore {
    private workspaceController = new WorkspaceController();
    @observable loadingActivities = [] as string[];

    @action.bound
    @errorToast("Failed to setup workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig) {
        await this.workspaceController.setupWorkspace(userConfigFilePath, config);
    }
}
