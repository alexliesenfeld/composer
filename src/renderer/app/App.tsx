import { NavButton } from '@/renderer/app/components/NavButton';
import { When } from '@/renderer/app/components/When';
import { FilesPage } from '@/renderer/app/containers/pages/files/FilesPage';
import { LogPage } from '@/renderer/app/containers/pages/log/LogPage';
import PropertiesPage from '@/renderer/app/containers/pages/properties/PropertiesPage';
import WelcomePage from '@/renderer/app/containers/pages/welcome/WelcomePage';
import { AppStore, Page } from '@/renderer/app/stores/app-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import {
    Alignment,
    Button,
    FocusStyleManager,
    Icon,
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
    LIST,
    PLAY,
} from '@blueprintjs/icons/lib/esm/generated/iconNames';

import '@public/style.scss';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore; workspaceStore?: WorkspaceStore }) => {
    const { userConfig } = props.workspaceStore!;

    if (!userConfig) {
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
                        <span> {props.workspaceStore!.userConfig!.projectName}</span>
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
                        icon={LIST}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
                    <NavButton
                        text="Packaging"
                        target={Page.PACKAGING}
                        icon={ARCHIVE}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavButton
                        target={Page.SETTINGS}
                        icon={COG}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
                    <NavButton
                        target={Page.LOG}
                        icon={CONSOLE}
                        selectedPage={props.appStore!.selectedPage}
                        onPageSelected={onPageSelected}
                    />
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
                    <PropertiesPage />
                </When>
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
