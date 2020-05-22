import { NavButton } from '@/renderer/app/components/NavButton';
import { When } from '@/renderer/app/components/When';
import { ConfigurationPage } from '@/renderer/app/containers/pages/configuration/ConfigurationPage';
import { FilesPage } from '@/renderer/app/containers/pages/files/FilesPage';
import { LogPage } from '@/renderer/app/containers/pages/log/LogPage';
import SettingsPage from '@/renderer/app/containers/pages/settings/SettingsPage';
import WelcomePage from '@/renderer/app/containers/pages/welcome/WelcomePage';
import { AppStore, Page } from '@/renderer/app/stores/app-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import {
    Alignment,
    Button,
    Classes,
    FocusStyleManager,
    Icon,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Position,
    Tooltip,
} from '@blueprintjs/core';
import {
    ARCHIVE,
    COG,
    CONSOLE,
    DOCUMENT,
    FLOPPY_DISK,
    FOLDER_SHARED_OPEN,
    LAYERS,
    PLAY,
    WRENCH,
} from '@blueprintjs/icons/lib/esm/generated/iconNames';

import '@public/style.scss';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore; workspaceStore?: WorkspaceStore }) => {
    const { workspaceConfig } = props.workspaceStore!;

    if (!workspaceConfig) {
        return <WelcomePage />;
    }

    const onPageSelected = (page: Page) => {
        props.appStore!.selectedPage = page;
    };

    return (
        <div>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>
                        <Icon icon={LAYERS} iconSize={20} className="logo" />
                        <span> {props.workspaceStore!.workspaceConfig!.projectName}</span>
                    </NavbarHeading>
                    <NavButton
                        text="Files"
                        target={Page.FILES}
                        icon={DOCUMENT}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
                    <NavButton
                        text="Configuration"
                        target={Page.PROPERTIES}
                        icon={WRENCH}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
                    <NavButton
                        text="Installer"
                        target={Page.PACKAGING}
                        icon={ARCHIVE}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                        disabled={true}
                    />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Tooltip content="Save" position={Position.BOTTOM}>
                        <Button
                            onClick={props.workspaceStore!.saveWorkspace}
                            className={Classes.MINIMAL}
                            icon={FLOPPY_DISK}
                        />
                    </Tooltip>
                    <Tooltip content="Open project directory" position={Position.BOTTOM}>
                        <Button
                            onClick={props.workspaceStore!.openProjectDirectoryInFileExplorer}
                            className={Classes.MINIMAL}
                            icon={FOLDER_SHARED_OPEN}
                        />
                    </Tooltip>
                    <NavbarDivider />
                    <Tooltip content="Settings" position={Position.BOTTOM}>
                        <NavButton
                            target={Page.SETTINGS}
                            icon={COG}
                            selectedPage={props.appStore!.selectedPage}
                            onPageSelected={onPageSelected}
                        />
                    </Tooltip>
                    <NavbarDivider />
                    <Tooltip content="Log Viewer" position={Position.BOTTOM}>
                        <NavButton
                            target={Page.LOG}
                            icon={CONSOLE}
                            selectedPage={props.appStore!.selectedPage}
                            onPageSelected={onPageSelected}
                        />
                    </Tooltip>
                    <NavbarDivider />
                    <Button
                        icon={PLAY}
                        text={`Open in ${props.appStore!.ideName}`}
                        intent={'success'}
                        onClick={props.workspaceStore!.startIDE}
                    />
                </NavbarGroup>
            </Navbar>
            <main className="content custom-scrollbar">
                <When condition={props.appStore!.selectedPage === Page.PROPERTIES}>
                    <ConfigurationPage />
                </When>
                <When condition={props.appStore!.selectedPage === Page.FILES}>
                    <FilesPage />
                </When>
                <When condition={props.appStore!.selectedPage === Page.LOG}>
                    <LogPage />
                </When>
                <When condition={props.appStore!.selectedPage === Page.SETTINGS}>
                    <SettingsPage />
                </When>
            </main>
        </div>
    );
};

export default inject('appStore', 'workspaceStore')(observer(App));
