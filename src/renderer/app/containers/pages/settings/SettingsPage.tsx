import * as React from 'react';
import { GeneralPanel } from '@/renderer/app/containers/pages/settings/components/GeneralPanel';
import { AppStore } from '@/renderer/app/stores/app-store';
import { inject, observer } from 'mobx-react';

const SettingsPage = (props: { appStore?: AppStore }) => {
    const setDarkTheme = (value: boolean) => {
        props.appStore!.darkTheme = value;
    };

    const setCodeEditorFontSize = (value: number) => {
        props.appStore!.codeEditorFontSize = value;
    };

    return (
        <div className="ConfigurationPage">
            <GeneralPanel
                darkTheme={props.appStore!.darkTheme}
                setDarkTheme={setDarkTheme}
                codeEditorFontSize={props.appStore!.codeEditorFontSize}
                setCodeEditorFontSize={setCodeEditorFontSize}
            />
        </div>
    );
};

export default inject('appStore')(observer(SettingsPage));
