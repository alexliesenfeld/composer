import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { inject, observer } from 'mobx-react';
import { useCallback } from 'react';
import * as React from 'react';
import { GlobalHotKeys, KeyMap } from 'react-hotkeys';

import { configure } from 'react-hotkeys';

configure({
    /**
     * The HTML tags that React HotKeys should ignore key events from. This only works
     * if you are using the default ignoreEventsCondition function.
     * @type {String[]}
     */
    ignoreTags: [], // default: 'input', 'select', 'textarea'
});

const keyMap: KeyMap = {
    SAVE_WORKSPACE: ['command+s', 'ctrl+s'],
};

const HotKeyListener = (props: { workspaceStore?: WorkspaceStore; children: React.ReactNode }) => {
    const saveWorkspace = useCallback(async () => {
        props.workspaceStore!.saveWorkspace();
    }, [props.workspaceStore]);

    const handlers = {
        SAVE_WORKSPACE: saveWorkspace,
    };

    return (
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
            {props.children}
        </GlobalHotKeys>
    );
};

export default inject('workspaceStore')(observer(HotKeyListener));
