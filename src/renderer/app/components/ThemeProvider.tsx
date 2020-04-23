import * as React from 'react';
import {inject, observer} from "mobx-react";
import {AppStore} from "@/renderer/app/stores/app-store";

@inject('appStore')
@observer
class ThemeProvider extends React.Component<{ appStore?: AppStore }> {
    render() {
        return (
            <div className={this.props.appStore!.darkTheme ? 'bp3-dark ThemeProvider' : 'ThemeProvider'}>
                {this.props.children}
            </div>
        );
    }
}

export default ThemeProvider;
