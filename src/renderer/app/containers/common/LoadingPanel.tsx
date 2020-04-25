import {H4, H5, H6, Spinner} from "@blueprintjs/core";
import * as React from 'react';
import {inject, observer} from "mobx-react";
import {AppStore} from "@/renderer/app/stores/app-store";

@inject('appStore')
@observer
class LoadingPanel extends React.Component<{ appStore?: AppStore }> {

    renderSpinnerIfNecessary(loadingText: string | undefined, activities: string[]) {
        if (loadingText) {
            return (
                <div className='LoadingPanel'>
                    <Spinner intent={"none"} size={50}/>
                    <H4 className='text'>{loadingText}</H4>
                    { activities.length > 0 ? <H6>{ activities[activities.length - 1]} ...</H6> : '' }
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderSpinnerIfNecessary(this.props.appStore!.loadingScreenText, this.props.appStore!.loadingActivities)}
                {this.props.children}
            </div>
        );
    }
}

export default LoadingPanel;
