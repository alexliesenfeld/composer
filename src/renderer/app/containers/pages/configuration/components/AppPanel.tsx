import {
    Card,
    Divider,
    Elevation,
    FormGroup,
    H5,
    NumericInput,
    Radio,
    RadioGroup,
} from '@blueprintjs/core';

import * as React from 'react';

export interface AppPanelProps {
    appChannels: number;
    setAppChannels: (value: number) => void;
}

const AppPanel = (props: AppPanelProps) => {
    const setAppChannels = (value: number) => {
        props.setAppChannels(value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Standalone App</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Input-Channels"
                    labelFor="input-channels"
                    inline={true}
                    helperText={
                        'The number of input channels. This value represents the iPlug configuration constant APP_NUM_CHANNELS.'
                    }
                >
                    <NumericInput
                        id="input-channels"
                        fill={true}
                        value={props.appChannels}
                        onValueChange={setAppChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Waiting Multiplier"
                    labelFor="vector-wait"
                    inline={true}
                    helperText={
                        'Audio signal waiting multiplicator that is used to avoid clicks. This value represents the iPlug configuration constant APP_N_VECTOR_WAIT.'
                    }
                >
                    <NumericInput
                        id="vector-wait"
                        fill={true}
                        input-channels
                        value={props.appChannels}
                        onValueChange={setAppChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Output Multiplicator"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'Output buffer multiplier. This value represents the iPlug configuration constant APP_MULT.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.appChannels}
                        onValueChange={setAppChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Signal Vector Size"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'Audio signal block size. This value represents the iPlug configuration constant APP_SIGNAL_VECTOR_SIZE.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.appChannels}
                        onValueChange={setAppChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Resizable"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={`If the app GUI is resizable. This value represents the iPlug configuration constant APP_RESIZABLE.`}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) => {
                            //props.setUiEnabled(value.currentTarget.value === 'yes')
                        }}
                        selectedValue={0}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>
                <FormGroup
                    label="Copy AUV3"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={`???. This value represents the iPlug configuration constant APP_COPY_AUV3.`}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) => {
                            //props.setUiEnabled(value.currentTarget.value === 'yes')
                        }}
                        selectedValue={0}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>
            </div>
        </Card>
    );
};

export default AppPanel;
