import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import * as path from 'path';
import * as url from 'url';
import {buildMenuTemplate, SAVE_MENU_ITEM_ID} from "@main/menu";
import {IPCMainEvents, IPCRendererEvents} from "@common/constants";
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';

let mainWindow: BrowserWindow | null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1024,
        show: false, // Hide initially. Will be shown later (see 'ready-to-show' event below).
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

    // Usually, when electron loads the app, during the react app is loading, the background color of the window
    // is white. For presentational reasons, the main window is not shown initially (see 'show: false' in the config
    // above), and only when the app is loaded into the browser window, the window is being presented to the user.
    mainWindow.on('ready-to-show', function() {
        mainWindow!.show();
        mainWindow!.focus();
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

if (process.env.NODE_ENV !== 'production') {
    app.whenReady().then(() => {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });
}
