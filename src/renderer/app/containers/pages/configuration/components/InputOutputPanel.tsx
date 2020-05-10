import {
    Card,
    Checkbox,
    Divider,
    Elevation,
    FormGroup,
    H5,
    NumericInput,
    Popover,
    Position,
    Radio,
    RadioGroup,
} from '@blueprintjs/core';
import * as React from 'react';

export interface InputOutputPanelProps {
    inputChannels: number;
    setInputChannels: (value: number) => void;
    outputChannels: number;
    setOutputChannels: (value: number) => void;
    pluginLatency: number;
    setPluginLatency: (value: number) => void;
    midiIn: boolean;
    setMidiIn: (value: boolean) => void;
    midiOut: boolean;
    setMidiOut: (value: boolean) => void;
    mpe: boolean;
    setMpe: (value: boolean) => void;
    stateChunks: boolean;
    setStateChunks: (value: boolean) => void;
}

const InputOutputPanel = (props: InputOutputPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Input/Output</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Input-Channels"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={'The number of input channels.'}
                >
                    <NumericInput
                        fill={true}
                        value={props.inputChannels}
                        onValueChange={(value) => props.setInputChannels(value)}
                    />
                </FormGroup>
                <FormGroup
                    label="Output-Channels"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={'The number of output channels.'}
                >
                    <NumericInput
                        fill={true}
                        value={props.outputChannels}
                        onValueChange={(value) => props.setOutputChannels(value)}
                    />
                </FormGroup>
                <FormGroup
                    label="Plug-In Latency"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={'The plugin latency announced to hosts.'}
                >
                    <NumericInput
                        fill={true}
                        value={props.pluginLatency}
                        onValueChange={(value) => props.setPluginLatency(value)}
                    />
                </FormGroup>

                <FormGroup
                    label="MIDI-In"
                    labelFor="midi-in"
                    inline={true}
                    helperText={'If the plugin needs to receive MIDI.'}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) => props.setMidiIn(value.currentTarget.value === 'yes')}
                        selectedValue={props.midiIn ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>

                <FormGroup
                    label="MIDI-Out"
                    labelFor="midi-out"
                    inline={true}
                    helperText={'If the plugin needs to send MIDI.'}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) => props.setMidiOut(value.currentTarget.value === 'yes')}
                        selectedValue={props.midiOut ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>

                <FormGroup
                    label="MPE"
                    labelFor="mpe"
                    inline={true}
                    helperText={'If the plugin uses MPE (MIDI Polyphonic Expression).'}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) => props.setMpe(value.currentTarget.value === 'yes')}
                        selectedValue={props.mpe ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>

                <FormGroup
                    label="State Chunks"
                    labelFor="state-chunks"
                    inline={true}
                    helperText={'If the plugin needs to receive state as chunks of memory.'}
                >
                    <RadioGroup
                        inline={true}
                        onChange={(value) =>
                            props.setStateChunks(value.currentTarget.value === 'yes')
                        }
                        selectedValue={props.stateChunks ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </FormGroup>
            </div>
        </Card>
    );
};

export default InputOutputPanel;
