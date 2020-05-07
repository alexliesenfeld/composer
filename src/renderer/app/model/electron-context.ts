import { UnsupportedOperationError } from '@/renderer/app/model/errors';
import { OperatingSystem } from '@/renderer/app/services/domain/common/model';
import { IPCMainEvents } from '@common/constants';
import { ipcRenderer, remote } from 'electron';

export abstract class ElectronContext {
    public static readonly dialog = remote.dialog;

    public static registerSaveProjectEventListener(listener: () => void) {
        ipcRenderer.on(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

    public static deregisterSaveProjectEventListener(listener: () => void) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

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
}
