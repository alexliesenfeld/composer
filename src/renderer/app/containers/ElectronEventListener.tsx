import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {ToastedFunction, toasted} from "@/renderer/app/util/app-toaster";

@inject('configStore')
@observer
class ElectronEventLister extends React.Component<{ configStore?: ConfigStore }> {
    save: ToastedFunction;
    createNewUserConfig: ToastedFunction;
    openConfigFromDialog: ToastedFunction;

    constructor(props: { configStore?: ConfigStore }) {
        super(props);
        this.save = toasted(this.props.configStore!.save);
        this.createNewUserConfig = toasted(this.props.configStore!.createNewUserConfig);
        this.openConfigFromDialog = toasted(this.props.configStore!.openConfigFromDialog);
    }

    componentDidMount(): void {
        ElectronContext.registerSaveProjectEventListener(this.save);
        ElectronContext.registerOpenProjectEventListener(this.openConfigFromDialog);
        ElectronContext.registerCreateNewProjectEventListener(this.createNewUserConfig);
    }

    componentWillUnmount(): void {
        ElectronContext.deregisterSaveProjectEventListener(this.save);
        ElectronContext.deregisterOpenProjectEventListener(this.openConfigFromDialog);
        ElectronContext.deregisterCreateNewProjectEventListener(this.createNewUserConfig);
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default ElectronEventLister;
