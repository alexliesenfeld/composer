import {
    Card,
    Checkbox,
    Divider,
    Elevation,
    FormGroup,
    H5,
    NumericInput,
    Radio,
    RadioGroup,
} from '@blueprintjs/core';
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
}

const UserInterfacePanel = (props: UserInterfacePanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Graphical User Interface</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Width"
                    labelFor="prototype-input"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The width of the plugin window in pixels. This value represents the iPlug configuration constant PLUG_WIDTH.`}
                >
                    <NumericInput
                        fill={true}
                        value={props.uiWidth}
                        onValueChange={(value) => props.setUiWidth(value)}
                        disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup
                    label="Height"
                    labelFor="prototype-input"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The height of the plugin window in pixels. This value represents the iPlug configuration constant PLUG_HEIGHT.`}
                >
                    <NumericInput
                        fill={true}
                        value={props.uiHeight}
                        onValueChange={(value) => props.setUiHeight(value)}
                        disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup
                    label="FPS"
                    labelFor="prototype-input"
                    disabled={!props.uiEnabled}
                    inline={true}
                    helperText={`The target frames per second that the window will be rendering at. This value represents the iPlug configuration constant PLUG_FPS.`}
                >
                    <NumericInput
                        fill={true}
                        value={props.fps}
                        onValueChange={(value) => props.setFps(value)}
                        disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup
                    label="Enabled"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={`If the plugin has a GUI. This value represents the iPlug configuration constant PLUG_HAS_UI.`}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) =>
                            props.setUiEnabled(value.currentTarget.value === 'yes')
                        }
                        selectedValue={props.uiEnabled ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>
            </div>
        </Card>
    );
};

export default UserInterfacePanel;
