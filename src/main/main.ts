import { app, BrowserWindow } from 'electron';
import electronDevtoolsInstaller, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as path from 'path';
import * as url from 'url';

let mainWindow: BrowserWindow | null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1024,
        show: false, // Hide initially (see 'ready-to-show' event below).
        webPreferences: {
            webSecurity: false,
            devTools: process.env.NODE_ENV !== 'production',
            nodeIntegration: true,
        },
    });

    // There is no menu in production
    if (process.env.NODE_ENV === 'production') {
        mainWindow.setMenu(null);
    }

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    );

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Usually, when electron loads the app, during the react app is loading,
    // the background color of the window is white. For presentational reasons,
    // the main window is not shown initially (see 'show: false' in the config
    // above), and only when the app is loaded into the browser window, the
    // window is being presented to the user.
    mainWindow.on('ready-to-show', () => {
        mainWindow!.show();
        mainWindow!.focus();
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
        electronDevtoolsInstaller(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });
}
