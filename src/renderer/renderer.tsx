import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {stores} from "./app/stores/";
import App from "@/renderer/app/containers/App";
import ElectronEventLister from "@/renderer/app/support/containers/ElectronEventListener";
import {HashRouter} from "react-router-dom"

ReactDOM.render(
    <Provider {...stores}>
        <HashRouter>
            <ElectronEventLister/>
            <App/>
        </HashRouter>
    </Provider>,
    document.getElementById("app")
);


