import { Classes, Code, Drawer, Pre } from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';

interface FontHelpPanelProps {
    fileName: string;
    variableName: string;
    isOpen: boolean;
    onClose: () => void;
}

export const FontHelpPanel = (props: FontHelpPanelProps) => {
    const fontId = props.fileName.substr(0, props.fileName.lastIndexOf('.'));
    return (
        <Drawer
            isOpen={props.isOpen}
            icon={HELP}
            onClose={props.onClose}
            usePortal={false}
            title={`How to use ${props.fileName}`}
            size={'70%'}
        >
            <div className={Classes.DRAWER_BODY}>
                <div className={Classes.DIALOG_BODY}>
                    <p>You can use the font like demonstrated in the following example:</p>
                    <Pre>
                        pGraphics->LoadFont("{fontId}", {props.variableName});
                    </Pre>
                    <p>
                        Based on the example above the font will be available using the font id{' '}
                        <Code>{fontId}</Code>.
                    </p>
                </div>
            </div>
            <div className={Classes.DRAWER_FOOTER}>
                File Name: {props.fileName}. Variable Name: {props.variableName}{' '}
            </div>
        </Drawer>
    );
};
