import { Card, Divider, Elevation, FormGroup, H5, NumericInput } from '@blueprintjs/core';

import * as React from 'react';

export interface AppPanelProps {
    waitMultiplier: number;
    setWaitMultiplier: (value: number) => void;
    outputMultiplier: number;
    setOutputMultiplier: (value: number) => void;
    signalVectorSize: number;
    setSignalVectorSize: (value: number) => void;
}

const AppPanel = (props: AppPanelProps) => {
    const setWaitMultiplier = (value: number) => {
        props.setWaitMultiplier(value);
    };

    const setOutputMultiplier = (value: number) => {
        props.setOutputMultiplier(value);
    };

    const setSignalVectorSize = (value: number) => {
        props.setSignalVectorSize(value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Standalone App</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Wait Multiplier"
                    labelFor="vector-wait"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_N_VECTOR_WAIT. Default: 0.'
                    }
                >
                    <NumericInput
                        id="vector-wait"
                        fill={true}
                        value={props.waitMultiplier}
                        onValueChange={setWaitMultiplier}
                    />
                </FormGroup>
                <FormGroup
                    label="Output Multiplicator"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_MULT. Default: 1.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.outputMultiplier}
                        onValueChange={setOutputMultiplier}
                    />
                </FormGroup>
                <FormGroup
                    label="Signal Vector Size"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_SIGNAL_VECTOR_SIZE. Default: 64.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.signalVectorSize}
                        onValueChange={setSignalVectorSize}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default AppPanel;
