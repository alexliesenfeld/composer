import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ElectronContext} from "@/renderer/app/model/electron-context";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";

@inject('workspaceStore')
@observer
class ElectronEventLister extends React.Component<{ workspaceStore?: WorkspaceStore }> {

    componentDidMount(): void {
        ElectronContext.registerSaveProjectEventListener(this.props.workspaceStore!.save);
        ElectronContext.registerOpenProjectEventListener(this.props.workspaceStore!.openConfigFromDialog);
        ElectronContext.registerCreateNewProjectEventListener(this.props.workspaceStore!.createNewUserConfig);
    }

    componentWillUnmount(): void {
        ElectronContext.deregisterSaveProjectEventListener(this.props.workspaceStore!.save);
        ElectronContext.deregisterOpenProjectEventListener(this.props.workspaceStore!.openConfigFromDialog);
        ElectronContext.deregisterCreateNewProjectEventListener(this.props.workspaceStore!.createNewUserConfig);
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default ElectronEventLister;