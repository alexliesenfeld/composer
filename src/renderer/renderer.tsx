import App from '@/renderer/app/App';
import ThemeProvider from '@/renderer/app/components/ThemeProvider';
import ElectronEventLister from '@/renderer/app/containers/common/ElectronEventListener';
import LoadingPanel from '@/renderer/app/containers/common/LoadingPanel';
import { setLoadingServiceContext } from '@/renderer/app/services/ui/loading-screen-service';
import { setLoggingServiceContext } from '@/renderer/app/services/ui/logging-service';
import { setNotificationServiceContext } from '@/renderer/app/services/ui/notification-service';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { stores } from './app/stores/';

setLoadingServiceContext(stores.appStore);
setLoggingServiceContext(stores.appStore);
setNotificationServiceContext(stores.appStore);

ReactDOM.render(
    <Provider {...stores}>
        <ThemeProvider>
            <ElectronEventLister>
                <LoadingPanel>
                    <App />
                </LoadingPanel>
            </ElectronEventLister>
        </ThemeProvider>
    </Provider>,
    document.getElementById('app'),
);
