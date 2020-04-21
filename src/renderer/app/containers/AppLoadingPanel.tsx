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
            const index = this.appStore.activities.lastIndexOf(id);
            if (index !== -1) {
                this.appStore.activities.splice(index, 1);
            }
        });

    }

    push(actionDescription: string): string {
        runInAction(() => this.appStore.activities.push(actionDescription));
        return actionDescription;
    }

    releaseLoadingScreen(): void {
        if (this.appStore.loadingScreenRequests > 0) {
            runInAction(() => this.appStore.loadingScreenRequests--);
        }
    }

    requestLoadingScreen(): void {
        runInAction(() => this.appStore.loadingScreenRequests++);
    }
}

@inject('appStore')
@observer
class AppLoadingPanel extends React.Component<{ appStore?: AppStore }> {

    componentDidMount(): void {
        setActivityContext(new AppLoadingPanelContext(this.props.appStore!));
    }

    renderSpinnerIfNecessary(loadingScreenRequests: number, loadingActivities: string[]) {
        if (loadingScreenRequests > 0 && loadingActivities.length > 0) {
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
                {this.renderSpinnerIfNecessary(this.props.appStore!.loadingScreenRequests, this.props.appStore!.activities)}
                {this.props.children}
            </div>
        );
    }
}

export default AppLoadingPanel;
