import {observable} from "mobx";

export class AppStore {
    @observable darkTheme: boolean = true;
    @observable loadingText: string | undefined;
}
