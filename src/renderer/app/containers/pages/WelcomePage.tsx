import * as React from 'react';
import {Button, Card} from "@blueprintjs/core";
import {DOCUMENT_OPEN, NEW_OBJECT} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {inject, observer} from "mobx-react";
import {ConfigStore} from "@/renderer/app/stores/configStore";

// Electron
const WelcomePage = (props: { configStore?: ConfigStore }) => {
    const {createNewUserConfig, openConfigFromDialog} = props.configStore!;
    return (
        <div className='WelcomePage'>
            <Card>
                <h3>Welcome to Composer!</h3>
                <p>Please load or create a new project to get started.</p>
                <Button icon={NEW_OBJECT} fill={true} onClick={createNewUserConfig} intent={"primary"}>New Project</Button>
                <Button icon={DOCUMENT_OPEN} fill={true} onClick={openConfigFromDialog} intent={"warning"}>Open Project</Button>
            </Card>
        </div>
    );
};

export default inject('configStore')(observer(WelcomePage))
