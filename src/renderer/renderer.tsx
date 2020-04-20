import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {stores} from "./app/stores/";
import App from "@/renderer/app/App";
import ElectronEventLister from "@/renderer/app/containers/ElectronEventListener";
import {HashRouter} from "react-router-dom"
import ThemeProvider from "@/renderer/app/components/ThemeProvider";
import AppLoadingPanel from "@/renderer/app/containers/AppLoadingPanel";

ReactDOM.render(
    <Provider {...stores}>
        <HashRouter>
            <ThemeProvider>
                <ElectronEventLister>
                    <AppLoadingPanel>
                        <App/>
                    </AppLoadingPanel>
                </ElectronEventLister>
            </ThemeProvider>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);


