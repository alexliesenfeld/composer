import { app, ipcMain, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import {buildMenuTemplate, SAVE_MENU_ITEM_ID} from "@main/menu";
import {IPCRendererEvents} from "@common/constants";

let mainWindow: BrowserWindow | null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1024,
        webPreferences: {
            webSecurity: false,
            devTools: process.env.NODE_ENV !== 'production',
            nodeIntegration: true,
        }
    });

    const menu = Menu.buildFromTemplate(buildMenuTemplate(mainWindow));
    Menu.setApplicationMenu(menu);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    registerRendererEventListeners(mainWindow, menu);
}

function registerRendererEventListeners(mainWindow: BrowserWindow, menu: Electron.Menu) {
    ipcMain.on(IPCRendererEvents.INIT_SET_CAN_SAVE, (event, enabled: boolean) => {
        menu.getMenuItemById(SAVE_MENU_ITEM_ID).enabled = enabled;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // On OS X stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        // TODO: Check if this is really required
        createWindow();
    }
});
