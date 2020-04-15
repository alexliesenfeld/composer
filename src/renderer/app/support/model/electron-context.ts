import {ipcRenderer, remote, shell, webFrame} from 'electron';

import {ExecutionContext} from "@/lib/execution-context";
import {IPCMainEvents, IPCRendererEvents} from "@common/constants";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import Shell = Electron.Shell;
import Dialog = Electron.Dialog;

export class ElectronContext extends ExecutionContext {
    readonly ipcRenderer: typeof ipcRenderer = ipcRenderer;
    readonly webFrame: typeof webFrame = webFrame;
    readonly remote: typeof remote = remote;
    readonly shell: Shell = shell;
    readonly dialog: Dialog = remote.dialog;

    constructor() {
        super();
    }

    enableSaveItemInWindowMenu(enable: boolean) {
        this.ipcRenderer.send(IPCRendererEvents.INIT_SET_CAN_SAVE, enable);
    }

    static registerEventListeners(handlingConfigStore: ConfigStore) {
        ipcRenderer.on(IPCMainEvents.INIT_SAVE_PROJECT, handlingConfigStore.save);
        ipcRenderer.on(IPCMainEvents.INIT_CREATE_NEW_PROJECT, handlingConfigStore.createNewUserConfig);
        ipcRenderer.on(IPCMainEvents.INIT_OPEN_PROJECT, handlingConfigStore.openConfigFromDialog);
    }

    static deregisterEventListeners(handlingConfigStore: ConfigStore) {
        ipcRenderer.removeListener(IPCMainEvents.INIT_SAVE_PROJECT, handlingConfigStore.save);
        ipcRenderer.removeListener(IPCMainEvents.INIT_CREATE_NEW_PROJECT, handlingConfigStore.createNewUserConfig);
        ipcRenderer.removeListener(IPCMainEvents.INIT_OPEN_PROJECT, handlingConfigStore.openConfigFromDialog);
    }
}

