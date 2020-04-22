import {Spinner} from "@blueprintjs/core";
import * as React from 'react';
import {inject, observer} from "mobx-react";
import {setLoadingScreenContext} from "@/renderer/app/services/ui/activity-util";
import {runInAction} from "mobx";
import {AppStore} from "@/renderer/app/stores/app-store";


@inject('appStore')
@observer
class AppLoadingPanel extends React.Component<{ appStore?: AppStore }> {

    componentDidMount(): void {
        const appStore = this.props.appStore!;
        setLoadingScreenContext({
            setLoadingText(text: string) {
                runInAction(() => appStore.loadingText = text);
            },
            removeLoadingText(): void {
                runInAction(() => appStore.loadingText = undefined);
            }
        });
    }

    renderSpinnerIfNecessary(loadingText: string | undefined) {
        if (loadingText) {
            return (
                <div className='SpinnerPanel'>
                    <Spinner intent={"none"} size={50}/>
                    <h3 className='text'>{loadingText}</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderSpinnerIfNecessary(this.props.appStore!.loadingText)}
                {this.props.children}
            </div>
        );
    }
}

export default AppLoadingPanel;
