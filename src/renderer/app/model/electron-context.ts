import { UnsupportedOperationError } from '@/renderer/app/model/errors';
import { OperatingSystem } from '@/renderer/app/services/domain/common/model';
import { remote } from 'electron';

export abstract class ElectronContext {
    public static readonly dialog = remote.dialog;
    public static readonly shell = remote.shell;
    public static readonly app = remote.app;

    public static currentOperatingSystem(): OperatingSystem {
        switch (process.platform) {
            case 'win32':
                return OperatingSystem.WINDOWS;
            case 'linux':
                return OperatingSystem.LINUX;
            case 'darwin':
                return OperatingSystem.MACOS;
            default:
                throw new UnsupportedOperationError(
                    `Operating system ${process.platform} mot supported`,
                );
        }
    }

    public static getAppVersion() {
        return ElectronContext.app.getVersion();
    }

    public static openUrlInExternalBrowser(url: string) {
        return ElectronContext.shell.openExternal(url);
    }

    public static openDirectoryInOsExplorer(path: string) {
        ElectronContext.shell.openItem(path);
    }

    public static locateFileInExplorer(filePath: string) {
        ElectronContext.shell.showItemInFolder(filePath);
    }

    public static openInExternalEditor(fileName: string) {
        return ElectronContext.shell.openItem(fileName);
    }

    public static showOpenDialog = ElectronContext.dialog.showOpenDialog;
}
