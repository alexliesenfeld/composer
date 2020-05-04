import {ipcRenderer, remote} from 'electron';
import {IPCMainEvents, IPCRendererEvents} from "@common/constants";
import {UnsupportedOperationError} from "@/renderer/app/model/errors";
import {OperatingSystem} from "@/renderer/app/services/domain/common/model";

export abstract class ElectronContext {
    static readonly remote = remote;
    static readonly dialog = remote.dialog;

    static enableSaveItemInWindowMenu(enable: boolean) {
        ipcRenderer.send(IPCRendererEvents.INIT_SET_CAN_SAVE, enable);
    }

    static registerSaveProjectEventListener(listener: () => void) {
        ipcRenderer.on(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

    static registerCreateNewProjectEventListener(listener: () => void) {
        ipcRenderer.on(IPCMainEvents.INIT_CREATE_NEW_PROJECT, listener);
    }

    static registerOpenProjectEventListener(listener: () => void) {
        ipcRenderer.on(IPCMainEvents.INIT_OPEN_PROJECT, listener);
    }

    static deregisterSaveProjectEventListener(listener: () => void) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_SAVE_PROJECT, listener);
    }

    static deregisterCreateNewProjectEventListener(listener: () => void) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_CREATE_NEW_PROJECT, listener);
    }

    static deregisterOpenProjectEventListener(listener: () => void) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_OPEN_PROJECT, listener);
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

