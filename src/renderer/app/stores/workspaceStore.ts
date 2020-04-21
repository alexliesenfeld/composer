import {action} from "mobx";
import {withErrorToast, showSuccessToast} from "@/renderer/app/util/app-toaster";
import {UserConfig} from "@/renderer/app/model/user-config";
import {withLoadingScreen} from "@/renderer/app/util/activity-util";
import {WorkspaceService} from "@/renderer/app/services/workspace-service";

export class WorkspaceStore {
    private readonly workspaceService = new WorkspaceService();

    @action.bound
    @withLoadingScreen
    @withErrorToast("Failed to setup workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig) {
        await this.workspaceService.setupWorkspace(userConfigFilePath, config);
        showSuccessToast("Successfully created workspace")
    }

}
