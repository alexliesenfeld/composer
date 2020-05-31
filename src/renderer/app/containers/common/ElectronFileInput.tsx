import { ElectronContext } from '@/renderer/app/model/electron-context';
import { Classes } from '@blueprintjs/core';
import * as React from 'react';

export interface ElectronFileInputProps {
    fill?: boolean;
    onValueSelected: (value: string) => void;
    text: React.ReactNode;
    hasSelection: boolean;
    buttonText: string;
    select: 'directory' | 'file';
}

export const ElectronFileInput = (props: ElectronFileInputProps) => {
    const spanProps = {
        [`${Classes.getClassNamespace()}-button-text`]: props.buttonText,
        className: `${Classes.FILE_UPLOAD_INPUT} ${Classes.FILE_UPLOAD_INPUT_CUSTOM_TEXT} ${
            props.hasSelection ? Classes.FILE_INPUT_HAS_SELECTION : ''
        }`,
    };

    const onClick = () => {
        ElectronContext.dialog
            .showOpenDialog({
                properties:
                    props.select === 'directory'
                        ? ['createDirectory', 'dontAddToRecent', 'openDirectory']
                        : ['openFile', 'dontAddToRecent', 'promptToCreate'],
            })
            .then((e: Electron.OpenDialogReturnValue) => {
                if (!e.canceled) {
                    props.onValueSelected(e.filePaths[0]);
                }
            });
    };

    return (
        <label className={`${Classes.FILE_INPUT} ${Classes.FILL}`}>
            <span {...spanProps} onClick={onClick}>
                {props.text}
            </span>
        </label>
    );
};
