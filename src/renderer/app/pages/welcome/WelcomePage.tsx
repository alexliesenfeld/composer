import * as React from 'react';
import {Button, Card} from "@blueprintjs/core";
import {DOCUMENT_OPEN, NEW_OBJECT} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {inject, observer} from "mobx-react";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";

const WelcomePage = (props: { workspaceStore?: WorkspaceStore }) => {
    return (
        <div className='WelcomePage'>
            <Card>
                <h3>Welcome to Composer!</h3>
                <p>Please load or create a new project to get started.</p>
                <Button icon={NEW_OBJECT} fill={true} onClick={props.workspaceStore!.createNewUserConfig} intent={"primary"}>New
                    Project</Button>
                <Button icon={DOCUMENT_OPEN} fill={true} onClick={props.workspaceStore!.openConfigFromDialog} intent={"warning"}>Open
                    Project</Button>
            </Card>
        </div>
    );
};

export default inject('workspaceStore')(observer(WelcomePage))
