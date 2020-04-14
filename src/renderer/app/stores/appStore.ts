import { observable, action, computed } from "mobx";
import {ElectronContext} from "@/renderer/app/support/electron-context";

export class AppStore {
    @observable electronContext: ElectronContext = new ElectronContext();

}
