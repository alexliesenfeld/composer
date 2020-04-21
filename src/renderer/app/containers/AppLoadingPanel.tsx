import {Spinner} from "@blueprintjs/core";
import * as React from 'react';
import {inject, observer} from "mobx-react";
import {AppStore} from "@/renderer/app/stores/appStore";
import {ActivityContext, setActivityContext} from "@/renderer/app/util/activity-util";
import {runInAction} from "mobx";

class AppLoadingPanelContext implements ActivityContext {
    constructor(private appStore: AppStore) {
    }

    pop(id: string): void {
        runInAction(() => {
            const index = this.appStore.loadingActivities.lastIndexOf(id);
            if (index !== -1) {
                this.appStore.loadingActivities.splice(index, 1);
            }
        });

    }

    push(actionDescription: string): string {
        runInAction(() => this.appStore.loadingActivities.push(actionDescription));
        return actionDescription;
    }
}

@inject('appStore')
@observer
class AppLoadingPanel extends React.Component<{ appStore?: AppStore }> {

    componentDidMount(): void {
        setActivityContext(new AppLoadingPanelContext(this.props.appStore!));
    }

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
