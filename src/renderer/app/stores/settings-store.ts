import { observable } from 'mobx';
import { persist } from 'mobx-persist';

export class SettingsStore {
    @persist @observable public darkTheme = true;
    @persist @observable public codeEditorFontSize = 14;
}
