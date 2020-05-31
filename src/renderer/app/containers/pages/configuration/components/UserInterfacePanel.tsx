import { CustomNumericInput } from '@/renderer/app/components/CustomNumericInput';
import { WorkspaceAttributeFormGroup } from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { Card, Divider, Elevation, H5, Radio, RadioGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface UserInterfacePanelProps {
    uiWidth: number;
    setUiWidth: (value: number) => void;
    uiHeight: number;
    setUiHeight: (value: number) => void;
    fps: number;
    setFps: (value: number) => void;
    uiEnabled: boolean;
    setUiEnabled: (value: boolean) => void;
    uiResizable: boolean;
    setUiResizable: (value: boolean) => void;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
}

const UserInterfacePanel = (props: UserInterfacePanelProps) => {
    const setUiWidth = (value: number) => {
        props.setUiWidth(value);
    };

    const setUiHeight = (value: number) => {
        props.setUiHeight(value);
    };

    const setFps = (value: number) => {
        props.setFps(value);
    };

    const setUiEnabled = (event: React.FormEvent<HTMLInputElement>) => {
        props.setUiEnabled(event.currentTarget.value === 'yes');
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Graphical User Interface</H5>
            <Divider />
            <div className="card-content">
                <WorkspaceAttributeFormGroup
                    label="Width"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The width of the plugin window in pixels. This value represents the iPlug configuration constant PLUG_WIDTH.`}
                    validationKey={'uiWidth'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.uiWidth}
                        onValueChange={setUiWidth}
                        disabled={!props.uiEnabled}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Height"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The height of the plugin window in pixels. This value represents the iPlug configuration constant PLUG_HEIGHT.`}
                    validationKey={'uiHeight'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.uiHeight}
                        onValueChange={setUiHeight}
                        disabled={!props.uiEnabled}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="FPS"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The target frames per second that the window will be rendering at. This value represents the iPlug configuration constant PLUG_FPS.`}
                    validationKey={'fps'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.fps}
                        onValueChange={setFps}
                        disabled={!props.uiEnabled}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Enabled"
                    inline={true}
                    helperText={`If the plugin has a GUI. This value represents the iPlug configuration constant PLUG_HAS_UI.`}
                    validationKey={'uiEnabled'}
                    validationErrors={props.validationErrors}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setUiEnabled}
                        selectedValue={props.uiEnabled ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default UserInterfacePanel;
