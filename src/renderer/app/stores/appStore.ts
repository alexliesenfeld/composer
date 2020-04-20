import {observable} from "mobx";

export class AppStore {
    @observable darkTheme: boolean = true;
    @observable loadingActivities = [] as string[];
}
