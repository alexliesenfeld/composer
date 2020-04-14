import * as React from 'react';
import {inject, observer} from "mobx-react";
import {AppStore} from "@/renderer/app/stores/appStore";
import {Route, Switch, useHistory} from "react-router-dom"
import ProjectsPage from "@/renderer/app/containers/pages/ProjectsPage";
import FilesPage from "@/renderer/app/containers/pages/FilesPage";
import {APPLICATION, ARCHIVE, COG, DOCUMENT, LAYERS, PLAY} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {
    Alignment,
    Button,
    Classes,
    FocusStyleManager,
    Icon,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading
} from "@blueprintjs/core";

import '@public/style.scss';

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore }) => {
    let history = useHistory();
    return (
        <div className='bp3-dark'>
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>
                        <Icon icon={LAYERS} iconSize={20} className='logo'/>
                        <span> Composer</span>
                    </NavbarHeading>
                    <NavbarDivider/>
                    <Button onClick={() => history.push("/projects")} className={Classes.MINIMAL} icon={APPLICATION}
                            text="Project"/>
                    <Button onClick={() => history.push("/files")} className={Classes.MINIMAL} icon={DOCUMENT}
                            text="Files"/>
                    <Button onClick={() => history.push("/installer")} className={Classes.MINIMAL} icon={ARCHIVE}
                            text="Installer"/>
                    <NavbarDivider/>
                    <Button onClick={() => history.push("/installer")} className={Classes.MINIMAL} icon={COG}
                            text="Settings"/>
                </NavbarGroup>

                <NavbarGroup align={Alignment.RIGHT}>
                    <Button icon={PLAY} text="Open IDE" intent={"success"}/>
                </NavbarGroup>
            </Navbar>

            <main className='content'>
                <Switch>
                    <Route path="/projects">
                        <ProjectsPage/>
                    </Route>
                    <Route path="/files">
                        <FilesPage/>
                    </Route>
                    <Route path="/installer">
                        <a>INSTALLER</a>
                    </Route>
                </Switch>
            </main>
        </div>
    );
};

export default inject('appStore')(observer(App))
