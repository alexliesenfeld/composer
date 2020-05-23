import { CustomNumericInput } from '@/renderer/app/components/CustomNumericInput';
import { WorkspaceAttributeFormGroup } from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { Card, Divider, Elevation, H5, NumericInput } from '@blueprintjs/core';

import * as React from 'react';

export interface AppPanelProps {
    waitMultiplier: number;
    setWaitMultiplier: (value: number) => void;
    outputMultiplier: number;
    setOutputMultiplier: (value: number) => void;
    signalVectorSize: number;
    setSignalVectorSize: (value: number) => void;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
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
                <WorkspaceAttributeFormGroup
                    label="Wait Multiplier"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_N_VECTOR_WAIT. Default: 0.'
                    }
                    validationKey={'appVectorWaitMultiplier'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.waitMultiplier}
                        onValueChange={setWaitMultiplier}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Output Multiplier"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_MULT. Default: 1.'
                    }
                    validationKey={'appOutputMultiplier'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.outputMultiplier}
                        onValueChange={setOutputMultiplier}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Signal Vector Size"
                    inline={true}
                    helperText={
                        'This value represents the iPlug configuration constant APP_SIGNAL_VECTOR_SIZE. Default: 64.'
                    }
                    validationKey={'appSignalVectorSize'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.signalVectorSize}
                        onValueChange={setSignalVectorSize}
                    />
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default AppPanel;
