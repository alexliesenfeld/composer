import * as React from 'react';
import {
    Card,
    Checkbox,
    Divider,
    Elevation,
    FormGroup,
    H5,
    InputGroup,
    NumericInput,
    Popover,
    Position
} from "@blueprintjs/core";
import {PluginFormat, Prototype} from "@/renderer/app/model/user-config";
import {SelectInput} from "@/renderer/app/components/SelectInput";

export interface InputOutputPanelProps {
    inputChannels: number,
    setInputChannels: (value: number) => void,
    outputChannels: number,
    setOutputChannels: (value: number) => void,
    pluginLatency: number,
    setPluginLatency: (value: number) => void,
    midiIn: boolean,
    setMidiIn: (value: boolean) => void,
    midiOut: boolean,
    setMidiOut: (value: boolean) => void,
    mpe: boolean,
    setMpe: (value: boolean) => void,
    stateChunks: boolean,
    setStateChunks: (value: boolean) => void,
}

const InputOutputPanel = (props: InputOutputPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Input/Output</H5>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Input-Channels" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.inputChannels}
                                  onValueChange={value => props.setInputChannels(value)}
                    />
                </FormGroup>
                <FormGroup className='middle-column' label="Output-Channels" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.outputChannels}
                                  onValueChange={value => props.setOutputChannels(value)}
                    />
                </FormGroup>
                <FormGroup className='middle-column' label="Plug-In Latency" labelFor="prototype-input">
                    <NumericInput placeholder="Enter a number..." fill={true}
                                  value={props.pluginLatency}
                                  onValueChange={value => props.setPluginLatency(value)}
                    />
                </FormGroup>
                <FormGroup className='right-column' label="Interfaces" labelFor="text-input">
                    <Checkbox label="MIDI-In" inline={true} checked={props.midiIn} onChange={() => props.setMidiIn(!props.midiIn)}/>
                    <Checkbox label="MIDI-Out" inline={true} checked={props.midiOut} onChange={() => props.setMidiOut(!props.midiOut)}/>
                    <Popover enforceFocus={false} interactionKind={"hover"}
                             popoverClassName="bp3-popover-content-sizing" position={Position.TOP}>
                        <Checkbox label="MPE" inline={true} checked={props.mpe} onChange={() => props.setMpe(!props.mpe)}/>
                        <div>
                            <H5>MIDI Polyphonic Expression (MPE)</H5>
                            <p>MPE is a method of using MIDI which enables multidimensional controllers to
                                control multiple parameters of every note within MPE-compatible software.</p>
                            <span>Source: https://www.midi.org/articles-old/midi-polyphonic-expression-mpe</span>
                        </div>
                    </Popover>
                    <Checkbox label="State Chunks" inline={true} checked={props.stateChunks} onChange={() => props.setStateChunks(!props.stateChunks)}/>
                </FormGroup>
            </div>
        </Card>
    );
};

export default InputOutputPanel;
