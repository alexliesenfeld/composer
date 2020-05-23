import { AppStore } from '@/renderer/app/stores/app-store';
import { H4, H6, Spinner } from '@blueprintjs/core';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

const LoadingPanel = (props: { appStore?: AppStore; children: React.ReactNode }) => {
    const renderSpinnerIfNecessary = (loadingText: string | undefined, activities: string[]) => {
        if (loadingText) {
            return (
                <div className="LoadingPanel">
                    <Spinner intent={'none'} size={50} />
                    <H4 className="text">{loadingText}</H4>
                    {activities.length > 0 ? <H6>{activities[activities.length - 1]} ...</H6> : ''}
                </div>
            );
        }
    };

    return (
        <div>
            {renderSpinnerIfNecessary(
                props.appStore!.loadingScreenText,
                props.appStore!.loadingActivities,
            )}
            {props.children}
        </div>
    );
};

export default inject('appStore')(observer(LoadingPanel));
