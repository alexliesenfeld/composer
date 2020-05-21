import {setLoadingServiceContext} from '@/renderer/app/services/ui/loading-screen-service';
import {
    Card,
    Divider,
    Elevation,
    FormGroup,
    H5,
    NumericInput,
    Radio,
    RadioGroup
} from '@blueprintjs/core';

import * as React from 'react';

export interface GeneralPanelProps {
    darkTheme: boolean;
    setDarkTheme: (value: boolean) => void;
    codeEditorFontSize: number;
    setCodeEditorFontSize: (value: number) => void;
}

export const GeneralPanel = (props: GeneralPanelProps) => {
    const setDarkMode = (value: React.ChangeEvent<HTMLInputElement>) => {
        props.setDarkTheme(value.currentTarget.value === 'dark');
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>General</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Theme"
                    labelFor="theme"
                    inline={true}
                    helperText={'The theme that will be used for this application.'}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setDarkMode}
                        selectedValue={props.darkTheme ? 'dark' : 'light'}
                    >
                        <Radio label="Dark" value="dark" />
                        <Radio label="Light" value="light" />
                    </RadioGroup>
                </FormGroup>
                <FormGroup
                    label="Code Editor Font Size"
                    inline={true}
                    helperText={`The size of the font in the code editor window.`}
                >
                    <NumericInput
                        fill={true}
                        value={props.codeEditorFontSize}
                        onValueChange={props.setCodeEditorFontSize}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};
