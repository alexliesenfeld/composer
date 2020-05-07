import { When } from '@/renderer/app/components/When';
import { FilesPage } from '@/renderer/app/containers/pages/files/FilesPage';
import { LogPage } from '@/renderer/app/containers/pages/log/LogPage';
import WelcomePage from '@/renderer/app/containers/pages/welcome/WelcomePage';
import { AppStore, Page } from '@/renderer/app/stores/app-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import {
    Alignment,
    Button,
    Classes,
    FocusStyleManager,
    Icon,
    IconName,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
} from '@blueprintjs/core';
import {
    ARCHIVE,
    COG,
    CONSOLE,
    DOCUMENT,
    LAYERS,
    PLAY,
} from '@blueprintjs/icons/lib/esm/generated/iconNames';

import '@public/style.scss';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore; workspaceStore?: WorkspaceStore }) => {
    const { userConfig } = props.workspaceStore!;

    const NavButton = (navProps: { text?: string; page: Page; icon: IconName }) => {
        return (
            <Button
                onClick={() => (props.appStore!.selectedPage = navProps.page)}
                intent={getIntentForLocation(props.appStore!.selectedPage, navProps.page)}
                className={Classes.MINIMAL}
                icon={navProps.icon}
                text={navProps.text}
            />
        );
    };

    const getIntentForLocation = (currentPage: Page, targetPage: Page): Intent => {
        return currentPage === targetPage ? 'primary' : 'none';
    };

    if (!userConfig) {
        return <WelcomePage />;
    }

    return (
        <div>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>
                        <Icon icon={LAYERS} iconSize={20} className="logo" />
                        <span> {props.workspaceStore!.userConfig!.projectName}</span>
                    </NavbarHeading>
                    <NavButton text="Files" page={Page.FILES} icon={DOCUMENT} />
                    <NavButton text="Packaging" page={Page.PACKAGING} icon={ARCHIVE} />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavButton page={Page.SETTINGS} icon={COG} />
                    <NavButton page={Page.LOG} icon={CONSOLE} />
                    <NavbarDivider />
                    <Button
                        icon={PLAY}
                        text={`Open in ${props.appStore!.ideName}`}
                        intent={'success'}
                        onClick={() => {
                            props.workspaceStore!.startIDE();
                        }}
                    />
                </NavbarGroup>
            </Navbar>
            <main className="content custom-scrollbar">
                <When condition={props.appStore!.selectedPage === Page.FILES}>
                    <FilesPage />
                </When>
                <When condition={props.appStore!.selectedPage === Page.LOG}>
                    <LogPage />
                </When>
            </main>
        </div>
    );
};

export default inject('appStore', 'workspaceStore')(observer(App));
