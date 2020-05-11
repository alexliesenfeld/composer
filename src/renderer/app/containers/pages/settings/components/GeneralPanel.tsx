import { Card, Divider, Elevation, FormGroup, H5, Radio, RadioGroup } from '@blueprintjs/core';

import * as React from 'react';

export interface GeneralPanelProps {
    darkTheme: boolean;
    setDarkTheme: (value: boolean) => void;
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
            </div>
        </Card>
    );
};
