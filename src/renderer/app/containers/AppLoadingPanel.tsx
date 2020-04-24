import {Pre, Spinner} from "@blueprintjs/core";
import * as React from 'react';
import {inject, observer} from "mobx-react";
import {setLoadingScreenContext} from "@/renderer/app/services/ui/activity-util";
import {runInAction} from "mobx";
import {AppStore} from "@/renderer/app/stores/app-store";

const setupLoadingScreenContext = (appStore: AppStore) => {
    setLoadingScreenContext({
        showLoadingScreen(text: string) {
            runInAction(() => appStore.loadingScreenText = text);
        },
        hideLoadingScreen(): void {
            runInAction(() => {
                appStore.loadingScreenText = undefined
                appStore.activities = [];
            });
        },
        pushEvent(message: string): void {
            runInAction(() => appStore.activities.push(`[${new Date().toLocaleTimeString()}] ${message}`));
        }
    });
};

@inject('appStore')
@observer
class AppLoadingPanel extends React.Component<{ appStore?: AppStore }> {

    componentDidMount(): void {
        const appStore = this.props.appStore!;
        setupLoadingScreenContext(appStore);
    }

    renderSpinnerIfNecessary(loadingText: string | undefined, activities: string[]) {
        if (loadingText) {
            return (
                <div className='AppLoadingPanel'>
                    <Spinner intent={"none"} size={50}/>
                    <h3 className='text'>{loadingText}</h3>
                    <Pre className='log'>
                        {activities.map(function(activity, index){
                            return <span className='log-entry' key={activity}>{activity}<br/></span>;
                        })}
                    </Pre>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderSpinnerIfNecessary(this.props.appStore!.loadingScreenText, this.props.appStore!.activities)}
                {this.props.children}
            </div>
        );
    }
}

export default AppLoadingPanel;
