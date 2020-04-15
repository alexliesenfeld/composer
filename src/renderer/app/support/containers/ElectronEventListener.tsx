import * as React from 'react';
import {useEffect} from 'react';
import {inject, observer} from "mobx-react";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";

const ElectronEventLister = (props: { configStore?: ConfigStore }) => {
    const {save, openConfigFromDialog, createNewUserConfig} = props.configStore!;

    // ~ componentDidMount
    useEffect(() => {
        ElectronContext.registerSaveProjectEventListener(save);
        ElectronContext.registerOpenProjectEventListener(openConfigFromDialog);
        ElectronContext.registerCreateNewProjectEventListener(createNewUserConfig);

        // ~ componentWillUnmount
        return () => {
            ElectronContext.deregisterSaveProjectEventListener(save);
            ElectronContext.deregisterOpenProjectEventListener(openConfigFromDialog);
            ElectronContext.deregisterCreateNewProjectEventListener(createNewUserConfig);
        }
    }, []);

    return <div className='ElectronEventLister' style={{display: 'none'}}/>;
};

export default inject('configStore')(observer(ElectronEventLister))
