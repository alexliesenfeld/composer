import * as React from 'react';
import {inject, observer} from "mobx-react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom"
import FilesPage from "@/renderer/app/pages/files/FilesPage";
import {APPLICATION, ARCHIVE, BUILD, COG, DOCUMENT, LAYERS, PLAY} from "@blueprintjs/icons/lib/esm/generated/iconNames";
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
import PropertiesPage from "@/renderer/app/pages/properties/PropertiesPage";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {AppStore} from "@/renderer/app/stores/app-store";

FocusStyleManager.onlyShowFocusOnTabs();

const App = (props: { appStore?: AppStore, workspaceStore?: WorkspaceStore }) => {
    const history = useHistory();
    const {userConfig} = props.workspaceStore!;

    const getIntentForLocation = (linkLocation: string): Intent => {
        return history.location.pathname === linkLocation ? "primary" : "none";
    };

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
                    <Button onClick={() => history.push("/properties")} intent={getIntentForLocation("/properties")}
                            className={Classes.MINIMAL} icon={APPLICATION}
                            text="Properties"/>
                    <Button onClick={() => history.push("/files")} intent={getIntentForLocation("/files")}
                            className={Classes.MINIMAL} icon={DOCUMENT}
                            text="Files"/>
                    <Button onClick={() => history.push("/packaging")} intent={getIntentForLocation("/packaging")}
                            className={Classes.MINIMAL} icon={ARCHIVE}
                            text="Packaging"/>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button onClick={() => history.push("/settings")} intent={getIntentForLocation("/settings")}
                            className={Classes.MINIMAL} icon={COG}/>
                    <NavbarDivider/>
                    <Button icon={PLAY} text="Open in Visual Studio" intent={"success"} onClick={() => {
                        props.workspaceStore!.startIde(props.workspaceStore!.configPath!, props.workspaceStore!.userConfig!);
                    }}/>
                </NavbarGroup>
            </Navbar>
            <main className='content custom-scrollbar'>
                <Switch>
                    <Route path="/properties">
                        <PropertiesPage/>
                    </Route>
                    <Route path="/files">
                        <FilesPage/>
                    </Route>
                    <Route path="/packaging">
                        <a>PACKAGING</a>
                    </Route>
                    <Route exact path="/" render={() => (
                        <Redirect to="/properties"/>
                    )}/>
                </Switch>

            </main>
        </div>
    );
};

export default inject('appStore', 'workspaceStore')(observer(App))
