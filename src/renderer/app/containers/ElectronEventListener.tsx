import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {ElectronContext} from "@/renderer/app/model/electron-context";

@inject('configStore')
@observer
class ElectronEventLister extends React.Component<{ configStore?: ConfigStore }> {

    componentDidMount(): void {
        ElectronContext.registerSaveProjectEventListener(this.props.configStore!.save);
        ElectronContext.registerOpenProjectEventListener(this.props.configStore!.openConfigFromDialog);
        ElectronContext.registerCreateNewProjectEventListener(this.props.configStore!.createNewUserConfig);
    }

    componentWillUnmount(): void {
        ElectronContext.deregisterSaveProjectEventListener(this.props.configStore!.save);
        ElectronContext.deregisterOpenProjectEventListener(this.props.configStore!.openConfigFromDialog);
        ElectronContext.deregisterCreateNewProjectEventListener(this.props.configStore!.createNewUserConfig);
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default ElectronEventLister;
