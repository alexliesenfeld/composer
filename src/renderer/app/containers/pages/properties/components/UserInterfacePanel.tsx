import * as React from 'react';
import {Card, Checkbox, Divider, Elevation, FormGroup, H5, NumericInput} from "@blueprintjs/core";

export interface UserInterfacePanelProps {
    uiWidth: number,
    setUiWidth: (value: number) => void,
    uiHeight: number,
    setUiHeight: (value: number) => void,
    fps: number,
    setFps: (value: number) => void,
    uiEnabled: boolean,
    setUiEnabled: (value: boolean) => void
    uiResizable: boolean,
    setUiResizable: (value: boolean) => void
}

const UserInterfacePanel = (props: UserInterfacePanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <div style={{display: 'flow-root'}}>
                <H5>User Interface</H5>
            </div>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Width" labelFor="prototype-input" disabled={!props.uiEnabled}>
                    <NumericInput placeholder="Enter a number..."
                                  fill={true}
                                  value={props.uiWidth}
                                  onValueChange={value => props.setUiWidth(value)}
                                  disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup className='middle-column' label="Height" labelFor="prototype-input"
                           disabled={!props.uiEnabled}>
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.uiHeight}
                                  onValueChange={value => props.setUiHeight(value)}
                                  disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup className='middle-column' label="FPS" labelFor="prototype-input" disabled={!props.uiEnabled}>
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.fps}
                                  onValueChange={value => props.setFps(value)}
                                  disabled={!props.uiEnabled}
                    />
                </FormGroup>
                <FormGroup className='right-column' label="Graphical User Interface" labelFor="prototype-input">
                    <Checkbox label="Enabled" inline={true}
                              checked={props.uiEnabled}
                              onChange={() => props.setUiEnabled(!props.uiEnabled)}
                    />
                    <Checkbox label="Resizable" inline={true}
                              checked={props.uiResizable}
                              onChange={() => props.setUiResizable(!props.uiResizable)}
                              disabled={!props.uiEnabled}
                    />
                </FormGroup>

            </div>
        </Card>
    );
};

export default UserInterfacePanel;
