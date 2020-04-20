import {Spinner} from "@blueprintjs/core";
import * as React from 'react';
import {inject, observer} from "mobx-react";
import {AppStore} from "@/renderer/app/stores/appStore";

@inject('appStore')
@observer
class AppLoadingPanel extends React.Component<{ appStore?: AppStore }> {

    renderSpinnerIfNecessary(loadingActivities: string[]) {
        if (loadingActivities.length > 0) {
            return (
                <div className='SpinnerPanel'>
                    <Spinner intent={"none"} size={50}/>
                    <h3 className='text'>{loadingActivities[loadingActivities.length - 1]}</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderSpinnerIfNecessary(this.props.appStore!.loadingActivities)}
                {this.props.children}
            </div>
        );
    }
}

export default AppLoadingPanel;
