import * as React from 'react';
import { GeneralPanel } from '@/renderer/app/containers/pages/settings/components/GeneralPanel';
import { AppStore } from '@/renderer/app/stores/app-store';
import { inject, observer } from 'mobx-react';

const SettingsPage = (props: { appStore?: AppStore }) => {
    const setDarkTheme = (value: boolean) => {
        props.appStore!.darkTheme = value;
    };

    return (
        <div className="ConfigurationPage">
            <GeneralPanel darkTheme={props.appStore!.darkTheme} setDarkTheme={setDarkTheme} />
        </div>
    );
};

export default inject('appStore')(observer(SettingsPage));
