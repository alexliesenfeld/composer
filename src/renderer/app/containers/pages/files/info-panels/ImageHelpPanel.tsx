import * as React from 'react';
import {Classes, Code, Drawer, H3, H4, H5, H6, Pre, Tag} from "@blueprintjs/core";
import {HELP} from "@blueprintjs/icons/lib/esm/generated/iconNames";

interface ImageHelpPanelProps {
    fileName: string
    variableName: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ImageHelpPanel = (props: ImageHelpPanelProps) => {
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
                    <H4>Windows / Visual Studio </H4>
                    <H5>
                        Generated code
                    </H5>
                    <p>
                        This tool will add the following code to <Code>config.h</Code>:
                    </p>
                    <Pre>
                        #define {props.variableName} "{props.fileName}"
                    </Pre>
                    <p>
                        It will also manipulate <Code>main.rc</Code> to include the image as a resource.

                        The image will then be available under the variable name <Tag>{props.variableName}</Tag>.
                    </p>
                    <H5>
                        Using {props.fileName}
                    </H5>
                    <p>
                        You can use the image like demonstrated in the following example:
                    </p>
                    <Pre>
                        const IBitmap bitmap1 = pGraphics->LoadBitmap({props.variableName}, 1);
                        <br/>
                        pGraphics->AttachControl(new IBitmapControl(0, 0, bitmap1));
                    </Pre>
                </div>
            </div>
            <div className={Classes.DRAWER_FOOTER}>File Name: {props.fileName}. Variable Name: {props.variableName} </div>
        </Drawer>
    );
};
