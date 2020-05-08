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
            <H5>User Interface</H5>
            <Divider />
            <div className="tab-page-card-content">
                <FormGroup
                    label="Width"
                    labelFor="prototype-input"
                    disabled={!props.uiEnabled}
                    inline={true}
                >
                    <NumericInput
                        placeholder="Enter a number..."
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
                >
                    <NumericInput
                        placeholder="Enter a number..."
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
                >
                    <NumericInput
                        placeholder="Enter a number..."
                        fill={true}
                        value={props.fps}
                        onValueChange={(value) => props.setFps(value)}
                        disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup
                    label="Resizable GUI"
                    labelFor="prototype-input"
                    inline={true}
                    disabled={!props.uiEnabled}
                >
                    <RadioGroup
                        inline={true}
                        disabled={!props.uiEnabled}
                        onChange={(value) =>
                            props.setUiResizable(value.currentTarget.value === 'yes')
                        }
                        selectedValue={props.uiResizable ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>
                <FormGroup label="GUI enabled" labelFor="prototype-input" inline={true}>
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
