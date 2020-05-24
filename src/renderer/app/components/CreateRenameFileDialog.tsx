import { Button, Classes, Dialog, FormGroup, Icon, InputGroup, Intent } from '@blueprintjs/core';
import { ADD, TRANSLATE } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as path from 'path';
import * as React from 'react';
import { useState } from 'react';

export interface CreateRenameFileDialogProps {
    initialValue: string;
    isOpen: boolean;
    allowedFileExtensions: string[];
    title: string;
    onCancel: () => void;
    onAccept: (fileName: string) => void;
    fileExists: (fileName: string | undefined) => boolean;
    mode: 'create' | 'rename';
}

const getErrorText = (
    touched: boolean,
    value: string | undefined,
    props: CreateRenameFileDialogProps,
) => {
    if (!touched) {
        return undefined;
    }

    if (!value || value.trim().length == 0) {
        return 'You need to provide a non-empty value.';
    } else if (value.includes(' ')) {
        return 'File names must not contain spaces.';
    } else if (props.initialValue === value) {
        return 'The new file name must differ from the original.';
    } else if (props.fileExists(value)) {
        return 'A file with this name already exists.';
    } else if (!props.allowedFileExtensions.includes(path.extname(value))) {
        return 'Possible file extensions are: ' + props.allowedFileExtensions.join(', ');
    }

    return undefined;
};

export const CreateOrRenameFileDialog = (props: CreateRenameFileDialogProps) => {
    const [value, setValue] = useState<string>(props.initialValue);
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
        return false; // prevent form submission
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
            <form onSubmit={onAccept} action="#">
                <div className={`${Classes.DIALOG_BODY} ${Classes.ALERT_BODY}`}>
                    <Icon
                        icon={props.mode === 'create' ? ADD : TRANSLATE}
                        intent={props.mode === 'create' ? Intent.SUCCESS : Intent.PRIMARY}
                        iconSize={50}
                    />
                    <FormGroup
                        label="File name"
                        labelFor="text-input"
                        helperText={errorText}
                        intent={errorText ? Intent.WARNING : Intent.NONE}
                        style={{ width: '100%' }}
                    >
                        <InputGroup
                            autoFocus={true}
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
                            intent={props.mode === 'create' ? Intent.SUCCESS : Intent.PRIMARY}
                            disabled={!touched || !!getErrorText(touched, value, props)}
                            type={'submit'}
                        >
                            {props.mode === 'create' ? 'Create' : 'Rename'}
                        </Button>
                    </div>
                </div>
            </form>
        </Dialog>
    );
};
