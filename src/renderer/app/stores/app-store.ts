import { LoadingServiceContext } from '@/renderer/app/services/ui/loading-screen-service';
import { LoggingServiceContext, LogLevel } from '@/renderer/app/services/ui/logging-service';
import { NotificationServiceContext } from '@/renderer/app/services/ui/notification-service';
import { action, observable } from 'mobx';

export interface AppStoreLogMessage {
    level: LogLevel;
    timestamp: Date;
    message: string;
}

export enum Page {
    PROPERTIES,
    FILES,
    PACKAGING,
    SETTINGS,
    LOG,
}

export interface WorkspaceMetadata {
    projectName: string;
    filePath: string;
}

export class AppStore
    implements LoadingServiceContext, LoggingServiceContext, NotificationServiceContext {
    @observable public darkTheme = true;
    @observable public logMessages: AppStoreLogMessage[] = [];
    @observable public isLoadingScreenShown: boolean;
    @observable public loadingScreenText: string | undefined;
    @observable public loadingActivities: string[] = [];
    @observable public selectedPage: Page = Page.FILES;

    constructor(public readonly ideName: string) {}

    @action.bound
    public showLoadingScreen(loadingText?: string): void {
        this.isLoadingScreenShown = true;
        this.loadingScreenText = loadingText;
    }

    @action.bound
    public hideLoadingScreen(): void {
        this.isLoadingScreenShown = false;
        this.loadingScreenText = undefined;
    }

    @action.bound
    public logActivityStarted(text: string): string {
        this.loadingActivities.push(text);
        this.log(`${text} ...`, LogLevel.INFO);

        return text;
    }

    @action.bound
    public logActivityEnded(id: string, error?: Error): void {
        const idx = this.loadingActivities.indexOf(id);
        this.log(
            `Activity "${this.loadingActivities[idx]}" ended ${
                error ? 'with error: ' + error.message : 'successfully'
            }`,
            error ? LogLevel.ERROR : LogLevel.DEBUG,
        );
        this.loadingActivities.splice(idx, 1);
    }

    @action.bound
    public log(message: string, level: LogLevel): void {
        this.logMessages.push({ timestamp: new Date(), message, level });
        if (this.logMessages.length > 100) {
            this.logMessages.splice(0, 1);
        }
    }

    @action.bound
    public logError(message: string): void {
        this.log(message, LogLevel.ERROR);
    }

    @action.bound
    public logDebug(message: string): void {
        this.log(message, LogLevel.DEBUG);
    }

    @action.bound
    public showLog(): void {
        this.selectedPage = Page.LOG;
    }
}
