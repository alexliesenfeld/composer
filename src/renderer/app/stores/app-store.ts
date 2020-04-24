import {observable} from "mobx";
export class AppStore {
    @observable darkTheme: boolean = true;
    @observable loadingScreenText: string | undefined;
    @observable activities = [] as string[];
}
