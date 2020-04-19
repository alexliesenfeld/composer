import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {stores} from "./app/stores/";
import App from "@/renderer/app/App";
import ElectronEventLister from "@/renderer/app/support/containers/ElectronEventListener";
import {HashRouter} from "react-router-dom"
import ThemeProvider from "@/renderer/app/support/components/ThemeProvider";

ReactDOM.render(
    <Provider {...stores}>
        <HashRouter>
            <ThemeProvider>
                <ElectronEventLister>
                    <App/>
                </ElectronEventLister>
            </ThemeProvider>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);


