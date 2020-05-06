import {ipcRenderer, remote} from 'electron';
import {IPCMainEvents} from "@common/constants";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";
import {OperatingSystem} from "@/renderer/app/services/domain/common/model";

export abstract class ElectronContext {
    static readonly dialog = remote.dialog;

    static registerSaveProjectEventListener(listener: () => void) {
        ipcRenderer.on(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

    static deregisterSaveProjectEventListener(listener: () => void) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

    static currentOperatingSystem(): OperatingSystem {
        switch (process.platform) {
            case "win32":
                return OperatingSystem.WINDOWS;
            case "linux":
                return OperatingSystem.LINUX;
            case "darwin":
                return OperatingSystem.MACOS;
            default:
                throw new UnsupportedOperationError(`Operating system ${process.platform} mot supported`);
        }
    }
}

