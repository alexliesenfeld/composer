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
                        onValueChange={setUiWidth}
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
                        onValueChange={setUiHeight}
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
                        onValueChange={setFps}
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
                        onChange={setUiEnabled}
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
