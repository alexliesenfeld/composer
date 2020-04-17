import {IPCMainEvents} from "@common/constants";

const electron = require('electron');

import BrowserWindow = Electron.BrowserWindow;
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import MenuItem = Electron.MenuItem;

export const SAVE_MENU_ITEM_ID = 'save-item';

export const buildMenuTemplate = (app: BrowserWindow): Array<(MenuItemConstructorOptions) | (MenuItem)> => {
    const template: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async function () {
                        await electron.shell.openExternal('https://github.com/alexliesenfeld/composer')
                    }
                },
                {
                    label: 'Report an Issue',
                    click: async function () {
                        await electron.shell.openExternal('https://github.com/alexliesenfeld/composer/issues')
                    }
                },
            ]
        },
    ];

    if (process.env.NODE_ENV !== 'production') {
        template.unshift({
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function (item: any, focusedWindow: any) {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+D',
                    click: function (item: any, focusedWindow: any) {
                        if (focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                },
            ]
        });
    }

    template.unshift({
        label: 'File',
        submenu: [
            {
                label: 'New',
                accelerator: 'CmdOrCtrl+N',
                click(menuItem, browserWindow) {
                    browserWindow.webContents.send(IPCMainEvents.INIT_CREATE_NEW_PROJECT)
                }
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+P',
                click(menuItem, browserWindow) {
                    browserWindow.webContents.send(IPCMainEvents.INIT_OPEN_PROJECT)
                }
            },
            {
                id: SAVE_MENU_ITEM_ID,
                accelerator: 'CmdOrCtrl+S',
                label: 'Save',
                enabled: false,
                click(menuItem, browserWindow) {
                    browserWindow.webContents.send(IPCMainEvents.INIT_SAVE_PROJECT);
                }
            }
        ]
    });

    if (process.platform === 'darwin') {
        template.unshift({
            label: "Composer",
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function () {
                        app.close();
                    }
                },
            ]
        });
    }

    return template;
};











































