import { AppStore } from '@/renderer/app/stores/app-store';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

@inject('appStore')
@observer
class ThemeProvider extends React.Component<{ appStore?: AppStore }> {
    render() {
        return (
            <div
                className={
                    this.props.appStore!.darkTheme ? 'bp3-dark ThemeProvider' : 'ThemeProvider'
                }
            >
                {this.props.children}
            </div>
        );
    }
}

export default ThemeProvider;
