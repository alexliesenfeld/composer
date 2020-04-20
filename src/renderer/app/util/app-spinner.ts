import {AppStore} from "@/renderer/app/stores/appStore";
import {runInAction} from "mobx";

export type LoadingScreenInfo = [((...args: any) => Promise<any | void | unknown>), string];
export type FunctionWithLoadingScreen = (...args: any[]) => void;

export const allWithLoadingScreen = (loadingScreenInfo: LoadingScreenInfo[]) => {
    return (appStore: AppStore) => {
        return loadingScreenInfo.map((f) => withLoadingScreen(f)(appStore));
    }
};

export const withLoadingScreen = (loadingScreenInfo: LoadingScreenInfo) => {
    return (appStore: AppStore) => {
        return (...args: any[]): void => {
            runInAction(() => {
                appStore.loadingActivities.push(loadingScreenInfo[1]);
            });

            loadingScreenInfo[0](...args).finally(() => {
                runInAction(() => {
                    const index = appStore.loadingActivities.lastIndexOf(loadingScreenInfo[1]);
                    if (index !== -1) {
                        appStore.loadingActivities.splice(index, 1);
                    }
                });
            });
        };
    };
};
