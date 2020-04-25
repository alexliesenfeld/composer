import {action, observable} from "mobx";
import {LoadingServiceContext} from "@/renderer/app/services/ui/loading-screen-service";
import {LoggingServiceContext, LogLevel} from "@/renderer/app/services/ui/logging-service";
import {NotificationServiceContext} from "@/renderer/app/services/ui/notification-service";

export interface AppStoreLogMessage {
    level: LogLevel,
    timestamp: Date;
    message: string;
}

export class AppStore implements LoadingServiceContext, LoggingServiceContext, NotificationServiceContext {
    @observable darkTheme: boolean = true;
    @observable logMessages: AppStoreLogMessage[] = [];
    @observable isLoadingScreenShown: boolean;
    @observable loadingScreenText: string | undefined;
    @observable loadingActivities: string[] = [];

    @action.bound
    showLoadingScreen(loadingText?: string): void {
        this.isLoadingScreenShown = true;
        this.loadingScreenText = loadingText;
    }

    @action.bound
    hideLoadingScreen(): void {
        this.isLoadingScreenShown = false;
        this.loadingScreenText = undefined;
    }

    @action.bound
    logActivityStarted(text: string): string {
        this.loadingActivities.push(text);
        this.log(`${text} ...`, LogLevel.INFO);
        return text;
    }

    @action.bound
    logActivityEnded(id: string, error?: Error): void {
        const idx = this.loadingActivities.indexOf(id);
        this.log(`Activity "${this.loadingActivities[idx]}" ended ${error ? 'with error: ' + error.message : 'successfully'}`,
            error ? LogLevel.ERROR : LogLevel.DEBUG);
        this.loadingActivities.splice(idx, 1);
    }

    @action.bound
    log(message: string, level: LogLevel): void {
        this.logMessages.push({timestamp: new Date(), message, level});
        if (this.logMessages.length > 100) {
            this.logMessages.splice(0, 1);
        }
    }

    @action.bound
    logError(message: string): void {
        this.log(message, LogLevel.ERROR);
    }

    @action.bound
    logDebug(message: string): void {
        this.log(message, LogLevel.DEBUG);
    }

    showLog(): void {
        // This assumes HashRouter is being used. It navigates directly using the window property.
        // If react-router-mobx or a similar package is being used, this line should be replaced.
        window.location.href = "#logs"
    }



}
