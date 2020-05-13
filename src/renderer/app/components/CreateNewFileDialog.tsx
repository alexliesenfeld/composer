import { Button, Classes, Dialog, FormGroup, Icon, InputGroup, Intent } from '@blueprintjs/core';
import { ADD } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as path from 'path';
import * as React from 'react';
import { useState } from 'react';

export interface CreateNewFileDialogProps {
    isOpen: boolean;
    allowedFileExtensions: string[];
    title: string;
    onCancel: () => void;
    onAccept: (fileName: string) => void;
    fileExists: (fileName: string | undefined) => boolean;
}

const getErrorText = (
    touched: boolean,
    value: string | undefined,
    props: CreateNewFileDialogProps,
) => {
    if (!touched) {
        return undefined;
    }

    if (!value || value.trim().length == 0) {
        return 'You need to provide a non-empty value.';
    } else if (value.includes(' ')) {
        return 'File names must not contain spaces.';
    } else if (props.fileExists(value)) {
        return 'A file with this name already exists.';
    } else if (!props.allowedFileExtensions.includes(path.extname(value))) {
        return 'Possible file extensions are: ' + props.allowedFileExtensions.join(', ');
    }

    return undefined;
};

function CreateFileDialog(props: CreateNewFileDialogProps) {
    const [value, setValue] = useState<string>('');
    const [touched, setTouched] = useState(false);
    const errorText = getErrorText(touched, value, props);

    const onTextChanged = (v: React.ChangeEvent<HTMLInputElement>) => {
        setTouched(true);
        setValue(v.target.value);
    };

    const reset = () => {
        setTouched(false);
        setValue('');
    };

    const onAccept = () => {
        props.onAccept(value);
        reset();
    };

    const onCancel = () => {
        props.onCancel();
        reset();
    };

    return (
        <Dialog
            isOpen={props.isOpen}
            onClose={props.onCancel}
            usePortal={false}
            title={props.title}
        >
            <div className={`${Classes.DIALOG_BODY} ${Classes.ALERT_BODY}`}>
                <Icon icon={ADD} intent={Intent.SUCCESS} iconSize={50} />
                <FormGroup
                    label="File name"
                    labelFor="text-input"
                    helperText={errorText}
                    intent={errorText ? Intent.WARNING : Intent.NONE}
                    style={{ width: '100%' }}
                >
                    <InputGroup
                        id="text-input"
                        placeholder="Please enter a file name ..."
                        value={value}
                        intent={errorText ? Intent.WARNING : Intent.NONE}
                        onChange={onTextChanged}
                    />
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        onClick={onAccept}
                        intent={Intent.SUCCESS}
                        disabled={!touched || !!getErrorText(touched, value, props)}
                    >
                        Create
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

const propsAreEqual = (prev: CreateNewFileDialogProps, next: CreateNewFileDialogProps) => {
    // Pretend content is considered equal if the dialog is not rendered anyways
    if (!prev.isOpen && !next.isOpen) {
        return true;
    }

    return (
        prev.isOpen === next.isOpen &&
        prev.allowedFileExtensions === next.allowedFileExtensions &&
        prev.title === next.title
    );
};

export default React.memo(CreateFileDialog, propsAreEqual);
