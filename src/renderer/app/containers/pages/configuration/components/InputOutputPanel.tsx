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
    const setMidiIn = (value: React.FormEvent<HTMLInputElement>) => {
        props.setMidiIn(value.currentTarget.value === 'yes');
    };

    const setMidiOut = (value: React.FormEvent<HTMLInputElement>) => {
        props.setMidiOut(value.currentTarget.value === 'yes');
    };

    const setMpe = (value: React.FormEvent<HTMLInputElement>) => {
        props.setMpe(value.currentTarget.value === 'yes');
    };

    const setStateChunks = (value: React.FormEvent<HTMLInputElement>) => {
        props.setStateChunks(value.currentTarget.value === 'yes');
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Input/Output</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Input-Channels"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'The number of input channels. This value partially represents the iPlug configuration constant PLUG_CHANNEL_IO.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.inputChannels}
                        onValueChange={props.setInputChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Output-Channels"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'The number of output channels. This value partially represents the iPlug configuration constant PLUG_CHANNEL_IO.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.outputChannels}
                        onValueChange={props.setOutputChannels}
                    />
                </FormGroup>
                <FormGroup
                    label="Plug-In Latency"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'The plugin latency announced to hosts. This value represents the iPlug configuration constant PLUG_LATENCY.'
                    }
                >
                    <NumericInput
                        fill={true}
                        value={props.pluginLatency}
                        onValueChange={props.setPluginLatency}
                    />
                </FormGroup>

                <FormGroup
                    label="MIDI-In"
                    labelFor="midi-in"
                    inline={true}
                    helperText={
                        'If the plugin needs to receive MIDI. This value represents the iPlug configuration constant PLUG_DOES_MIDI_IN.'
                    }
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMidiIn}
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
                    helperText={
                        'If the plugin needs to send MIDI. This value represents the iPlug configuration constant PLUG_DOES_MIDI_OUT.'
                    }
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMidiOut}
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
                    helperText={
                        'If the plugin uses MPE (MIDI Polyphonic Expression). This value represents the iPlug configuration constant PLUG_DOES_MPE.'
                    }
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMpe}
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
                    helperText={
                        'If the plugin needs to receive state as chunks of memory. This value represents the iPlug configuration constant PLUG_DOES_STATE_CHUNKS.'
                    }
                >
                    <RadioGroup
                        inline={true}
                        onChange={setStateChunks}
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
