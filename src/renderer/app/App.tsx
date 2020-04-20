import * as React from 'react';
import {inject, observer} from "mobx-react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom"
import ProjectsPage from "@/renderer/app/pages/project/ProjectPage";
import FilesPage from "@/renderer/app/pages/files/FilesPage";
import {APPLICATION, ARCHIVE, COG, DOCUMENT, LAYERS, PLAY} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {
    Alignment,
    Button,
    Classes,
    FocusStyleManager,
    Icon,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";

import '@public/style.scss';
import WelcomePage from "@/renderer/app/pages/welcome/WelcomePage";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {AppStore} from "@/renderer/app/stores/appStore";
import * as workspace from "@/renderer/app/controllers/workspace";
import {allWithLoadingScreen} from "@/renderer/app/util/app-spinner";

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore, configStore?: ConfigStore }) => {
    let history = useHistory();
    let {userConfig} = props.configStore!;

    const getIntentForLocation = (linkLocation: string): Intent => {
        return history.location.pathname === linkLocation ? "primary" : "none";
    };

    const [downloadIPlug2FromGithub, downloadIPlug2FromGithub2, downloadIPlug2FromGithu3, downloadIPlug2FromGithu4] =
        allWithLoadingScreen([
            [workspace.downloadIPlug2FromGithub, "Downloading iPlug2 from GitHub ..."],
            [workspace.downloadIPlug2FromGithub, "Downloading iPlug2 from GitHub ..."],
            [workspace.downloadIPlug2FromGithub, "Downloading iPlug2 from GitHub ..."],
            [workspace.downloadIPlug2FromGithub, "Downloading iPlug2 from GitHub ..."],
        ])(props.appStore!);

    if (!userConfig) {
        return <WelcomePage/>;
    }

    return (
        <div>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>
                        <Icon icon={LAYERS} iconSize={20} className='logo'/>
                        <span> Composer</span>
                    </NavbarHeading>
                    <NavbarDivider/>
                    <span> {userConfig.projectName}</span>
                    <NavbarDivider/>
                    <Button onClick={() => history.push("/project")} intent={getIntentForLocation("/project")}
                            className={Classes.MINIMAL} icon={APPLICATION}
                            text="Project"/>
                    <Button onClick={() => history.push("/files")} intent={getIntentForLocation("/files")}
                            className={Classes.MINIMAL} icon={DOCUMENT}
                            text="Files"/>
                    <Button onClick={() => history.push("/installer")} intent={getIntentForLocation("/installer")}
                            className={Classes.MINIMAL} icon={ARCHIVE}
                            text="Installer"/>
                    <NavbarDivider/>
                    <Button onClick={() => history.push("/settings")} intent={getIntentForLocation("/settings")}
                            className={Classes.MINIMAL} icon={COG}
                            text="Settings"/>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button icon={PLAY} text="Open in Visual Studio" intent={"success"} onClick={() => {
                        downloadIPlug2FromGithub(props.configStore!.configPath!, '2d8bccf670b983c20fd73cb9e47358255f50093e');
                    }}/>
                </NavbarGroup>
            </Navbar>
            <main className='content custom-scrollbar'>
                <Switch>
                    <Route path="/project">
                        <ProjectsPage/>
                    </Route>
                    <Route path="/files">
                        <FilesPage/>
                    </Route>
                    <Route path="/installer">
                        <a>INSTALLER</a>
                    </Route>
                    <Route exact path="/" render={() => (
                        <Redirect to="/project"/>
                    )}/>
                </Switch>

            </main>
        </div>
    );
};

export default inject('appStore', 'configStore')(observer(App))
