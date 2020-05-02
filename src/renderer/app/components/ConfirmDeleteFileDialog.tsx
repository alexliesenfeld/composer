import * as React from 'react';
import {Alert, Intent,} from "@blueprintjs/core";


export interface ConfirmDeleteFileDialogProps {
    fileName: string | undefined;
    onCancel: () => void;
    onAccept: () => void;

    // Alert does not provide a possibility to use a custom portal. Therefore, we need the theme here.
    // TODO: Remove if there is a way to set this globally!
    darkTheme: boolean;
}

export const ConfirmDeleteFileDialog = (props: ConfirmDeleteFileDialogProps) => {
    return (
        <Alert
            className={props.darkTheme ? 'bp3-dark' : ''}
            canEscapeKeyCancel={true}
            cancelButtonText="Cancel"
            confirmButtonText="Delete"
            icon="trash"
            intent={Intent.DANGER}
            isOpen={!!props.fileName}
            onCancel={props.onCancel}
            onConfirm={props.onAccept}
        >
            <p>
                Do your really want to delete <b>{props.fileName}</b>?
            </p>
        </Alert>

    );
};
