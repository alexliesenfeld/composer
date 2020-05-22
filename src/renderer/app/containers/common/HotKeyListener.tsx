import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { inject, observer } from 'mobx-react';
import { useCallback } from 'react';
import * as React from 'react';
import { GlobalHotKeys, KeyMap } from 'react-hotkeys';

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
