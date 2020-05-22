import { SettingsStore } from '@/renderer/app/stores/settings-store';
import * as React from 'react';
import { GeneralPanel } from '@/renderer/app/containers/pages/settings/components/GeneralPanel';
import { inject, observer } from 'mobx-react';

const SettingsPage = (props: { settingsStore?: SettingsStore }) => {
    const setDarkTheme = (value: boolean) => {
        props.settingsStore!.darkTheme = value;
    };

    const setCodeEditorFontSize = (value: number) => {
        props.settingsStore!.codeEditorFontSize = value;
    };

    return (
        <div className="ConfigurationPage">
            <GeneralPanel
                darkTheme={props.settingsStore!.darkTheme}
                setDarkTheme={setDarkTheme}
                codeEditorFontSize={props.settingsStore!.codeEditorFontSize}
                setCodeEditorFontSize={setCodeEditorFontSize}
            />
        </div>
    );
};

export default inject('settingsStore')(observer(SettingsPage));
