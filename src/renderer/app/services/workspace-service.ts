import {Fs} from "@/renderer/app/util/fs";
import * as path from "path";
import {
    deleteFileIfExists,
    deleteFolderRecursive,
    downloadFile,
    ensureDirExists,
    unzipFile
} from "@/renderer/app/util/file-utils";
import {activity} from "@/renderer/app/util/activity-util";
import {UserConfig} from "@/renderer/app/model/user-config";

export class WorkspaceService {

    @activity("Setting up workspace")
    async setupWorkspace(userConfigFilePath: string, config: UserConfig) {
        await this.downloadIPlug2FromGithub(userConfigFilePath, config.iPlug2GitSha);
    }

    @activity("Downloading iPlug2 from GitHub")
    private async downloadIPlug2FromGithub(userConfigFilePath: string, shaRef?: string): Promise<void> {
        const projectDirPath = path.dirname(userConfigFilePath);
        const iPlug2DirPath = this.getIPlug2DirPath(projectDirPath);
        const zipFilePath = path.join(iPlug2DirPath, `${shaRef}.zip`);
        const targetDirPath = path.join(iPlug2DirPath, shaRef!);
        const zipFileContentDirPath = path.join(iPlug2DirPath, `iPlug2-${shaRef}`);

        await ensureDirExists(iPlug2DirPath);
        await deleteFileIfExists(zipFilePath);

        await downloadFile(`https://github.com/iPlug2/iPlug2/archive/${shaRef}.zip`, zipFilePath);
        await unzipFile(zipFilePath, iPlug2DirPath);
        await Fs.unlink(zipFilePath);

        await deleteFolderRecursive(targetDirPath);
        await Fs.rename(zipFileContentDirPath, targetDirPath);
    }

    private getDependenciesDirPath(projectDir: string) {
        return path.join(projectDir, "dependencies");
    }

    private getIPlug2DirPath(projectDir: string) {
        return path.join(this.getDependenciesDirPath(projectDir), "iPlug2");
    }

}
