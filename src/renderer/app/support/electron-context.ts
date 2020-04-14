import {ipcRenderer, remote, webFrame, dialog, shell} from 'electron';

import {ExecutionContext} from "@/lib/execution-context";
import Shell = Electron.Shell;
import Dialog = Electron.Dialog;


export class ElectronContext extends ExecutionContext {
    readonly ipcRenderer: typeof ipcRenderer;
    readonly webFrame: typeof webFrame;
    readonly remote: typeof remote;
    readonly shell: Shell;
    readonly dialog: Dialog;

    constructor(){
        super();
        this.ipcRenderer = require('electron').ipcRenderer;
        this.webFrame = require('electron').webFrame;
        this.remote = require('electron').remote;
        this.shell = require('electron').shell;
        this.dialog = require('electron').remote.dialog;
    }
}

