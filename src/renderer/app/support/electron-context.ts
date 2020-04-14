import {ipcRenderer, remote, webFrame} from 'electron';

import {ExecutionContext} from "@/lib/context";
import * as fs from 'fs';
import * as util from 'util';
import * as childProcess from 'child_process';
import Shell = Electron.Shell;
import Dialog = Electron.Dialog;
const electron = require("electron");

export class ElectronContext implements ExecutionContext {
    ipcRenderer: typeof ipcRenderer = ipcRenderer;
    webFrame: typeof webFrame = webFrame;
    remote: typeof remote = remote;
    shell: Shell = electron.shell;
    dialog: Dialog = electron.dialog;
    childProcess: typeof childProcess = childProcess;
    fs: typeof fs = require('fs');
    util: typeof util = require('util');
}

