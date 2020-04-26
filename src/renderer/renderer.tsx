import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "mobx-react";
import {stores} from "./app/stores/";
import App from "@/renderer/app/App";
import ElectronEventLister from "@/renderer/app/containers/common/ElectronEventListener";
import ThemeProvider from "@/renderer/app/components/ThemeProvider";
import LoadingPanel from "@/renderer/app/containers/common/LoadingPanel";
import {setLoadingServiceContext} from "@/renderer/app/services/ui/loading-screen-service";
import {setLoggingServiceContext} from "@/renderer/app/services/ui/logging-service";
import {setNotificationServiceContext} from "@/renderer/app/services/ui/notification-service";

setLoadingServiceContext(stores.appStore);
setLoggingServiceContext(stores.appStore);
setNotificationServiceContext(stores.appStore);

ReactDOM.render(
    <Provider {...stores}>
        <ThemeProvider>
            <ElectronEventLister>
                <LoadingPanel>
                    <App/>
                </LoadingPanel>
            </ElectronEventLister>
        </ThemeProvider>
    </Provider>,
    document.getElementById("app")
);


