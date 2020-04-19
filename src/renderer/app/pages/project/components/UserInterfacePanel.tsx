import * as React from 'react';
import {Card, Checkbox, Divider, Elevation, FormGroup, H5, InputGroup, NumericInput} from "@blueprintjs/core";
import {PluginFormat, Prototype} from "@/lib/model/user-config";
import {SelectInput, SelectInputItem} from "@/renderer/app/support/components/SelectInput";
import {enumEntries} from "@/renderer/app/support/util/enum-utils";

export interface UserInterfacePanelProps {
    uiWidth: number,
    setUiWidth: (value: number) => void,
    uiHeight: number,
    setUiHeight: (value: number) => void,
    fps: number,
    setFps: (value: number) => void,
    uiEnabled: boolean,
    setUiEnabled: (value: boolean) => void
}

const UserInterfacePanel = (props: UserInterfacePanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <input value={new Date().toString()}/>
            <div style={{display: 'flow-root'}}>
                <H5>User Interface</H5>
            </div>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Width" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..."
                                  fill={true}
                                  value={props.uiWidth}
                                  onValueChange={value => props.setUiWidth(value)}/>
                </FormGroup>
                <FormGroup className='middle-column' label="Height" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.uiHeight}
                                  onValueChange={value => props.setUiHeight(value)}
                    />
                </FormGroup>
                <FormGroup className='middle-column' label="FPS" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.fps}
                                  onValueChange={value => props.setFps(value)}
                    />
                </FormGroup>
                <FormGroup className='right-column' label="Graphical User Interface" labelFor="prototype-input">
                    <Checkbox label="Enabled" inline={true}
                              checked={props.uiEnabled}
                              onChange={() => props.setUiEnabled(!props.uiEnabled)}
                    />
                </FormGroup>

            </div>
        </Card>
    );
};

export default React.memo(UserInterfacePanel);
