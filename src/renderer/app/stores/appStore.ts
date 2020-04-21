import {observable} from "mobx";

export class AppStore {
    @observable darkTheme: boolean = true;
    @observable activities = [] as string[];
    @observable loadingScreenRequests = 0;
}
