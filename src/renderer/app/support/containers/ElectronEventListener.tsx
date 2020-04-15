import * as React from 'react';
import {inject, observer} from "mobx-react";
import {useEffect} from "react";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {ElectronContext} from "@/renderer/app/support/model/electron-context";

const ElectronEventLister = (props: { configStore?: ConfigStore }) => {

    // ~ componentDidMount
    useEffect(() => {
        ElectronContext.registerEventListeners(props.configStore!);

        // ~ componentWillUnmount
        return () => {
            ElectronContext.deregisterEventListeners(props.configStore!);
        }
    }, []);

    return <div className='ElectronEventLister' style={{ display: 'none' }}/>;
};

export default inject('configStore')(observer(ElectronEventLister))
