import { AppStore } from '@/renderer/app/stores/app-store';
import {SettingsStore} from '@/renderer/app/stores/settings-store';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

@inject('settingsStore')
@observer
class ThemeProvider extends React.Component<{ settingsStore?: SettingsStore }> {
    render() {
        return (
            <div
                className={
                    this.props.settingsStore!.darkTheme ? 'bp3-dark ThemeProvider' : 'ThemeProvider'
                }
            >
                {this.props.children}
            </div>
        );
    }
}

export default ThemeProvider;
