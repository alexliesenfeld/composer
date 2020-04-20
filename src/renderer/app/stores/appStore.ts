import {observable} from "mobx";

export class AppStore {
    @observable darkTheme: boolean = true;
    @observable loading: boolean = false;
    @observable loadingText: string | undefined;
}
