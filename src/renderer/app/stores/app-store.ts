import {action, observable} from "mobx";
import {LoadingServiceContext} from "@/renderer/app/services/ui/loading-screen-service";
import {LoggingServiceContext, LogLevel} from "@/renderer/app/services/ui/logging-service";
import {NotificationServiceContext} from "@/renderer/app/services/ui/notification-service";
import {fileExistsSync} from "tsconfig-paths/lib/filesystem";

export interface AppStoreLogMessage {
    level: LogLevel,
    timestamp: Date;
    message: string;
}

export enum Page {
    FILES,
    PACKAGING,
    SETTINGS,
    LOG
}

export interface ProjectMetadata {
    projectName: string;
    filePath: string;
}

export class AppStore implements LoadingServiceContext, LoggingServiceContext, NotificationServiceContext {
    @observable darkTheme: boolean = true;
    @observable logMessages: AppStoreLogMessage[] = [];
    @observable isLoadingScreenShown: boolean;
    @observable loadingScreenText: string | undefined;
    @observable loadingActivities: string[] = [];
    @observable selectedPage: Page = Page.FILES;
    @observable recentlyOpenedProjects: ProjectMetadata[] = [];

    constructor(public readonly ideName: string) {
        const lastOpenedProjectsJson = localStorage.getItem("recentlyOpenedProjects");
        if (lastOpenedProjectsJson) {
            this.recentlyOpenedProjects = JSON.parse(lastOpenedProjectsJson);
            this.recentlyOpenedProjects = this.recentlyOpenedProjects.filter(f => fileExistsSync(f.filePath));
        }
    }

    @action.bound
    addRecentlyOpenedProject(projectName: string, filePath: string): void {
        this.removeRecentlyOpenedProject(projectName);
        this.recentlyOpenedProjects = [{projectName, filePath}, ...this.recentlyOpenedProjects];
        if (this.recentlyOpenedProjects.length > 5) {
            this.recentlyOpenedProjects.pop();
        }
        localStorage.setItem("recentlyOpenedProjects", JSON.stringify(this.recentlyOpenedProjects));
    }

    @action.bound
    removeRecentlyOpenedProject(filePath: string): void {
        const recentProjectIdx = this.recentlyOpenedProjects.findIndex(e => e.filePath === filePath);
        if (recentProjectIdx > -1) {
            this.recentlyOpenedProjects.splice(recentProjectIdx, 1);
            localStorage.setItem("recentlyOpenedProjects", JSON.stringify(this.recentlyOpenedProjects));
        }
    }

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

    @action.bound
    showLog(): void {
        this.selectedPage = Page.LOG;
    }

}
