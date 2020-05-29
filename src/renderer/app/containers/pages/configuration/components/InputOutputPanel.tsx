import { CustomNumericInput } from '@/renderer/app/components/CustomNumericInput';
import { WorkspaceAttributeFormGroup } from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { Card, Divider, Elevation, H5, Radio, RadioGroup } from '@blueprintjs/core';
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
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
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
                <WorkspaceAttributeFormGroup
                    label="Input-Channels"
                    inline={true}
                    helperText={
                        'The number of input channels. This value partially represents the iPlug configuration constant PLUG_CHANNEL_IO.'
                    }
                    validationKey={'inputChannels'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.inputChannels}
                        onValueChange={props.setInputChannels}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Output-Channels"
                    inline={true}
                    helperText={
                        'The number of output channels. This value partially represents the iPlug configuration constant PLUG_CHANNEL_IO.'
                    }
                    validationKey={'outputChannels'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.outputChannels}
                        onValueChange={props.setOutputChannels}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Plugin Latency"
                    inline={true}
                    helperText={
                        'The plugin latency announced to hosts. This value represents the iPlug configuration constant PLUG_LATENCY.'
                    }
                    validationKey={'pluginLatency'}
                    validationErrors={props.validationErrors}
                >
                    <CustomNumericInput
                        fill={true}
                        value={props.pluginLatency}
                        onValueChange={props.setPluginLatency}
                    />
                </WorkspaceAttributeFormGroup>

                <WorkspaceAttributeFormGroup
                    label="MIDI-In"
                    inline={true}
                    helperText={
                        'If the plugin needs to receive MIDI. This value represents the iPlug configuration constant PLUG_DOES_MIDI_IN.'
                    }
                    validationKey={'midiIn'}
                    validationErrors={props.validationErrors}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMidiIn}
                        selectedValue={props.midiIn ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </WorkspaceAttributeFormGroup>

                <WorkspaceAttributeFormGroup
                    label="MIDI-Out"
                    inline={true}
                    helperText={
                        'If the plugin needs to send MIDI. This value represents the iPlug configuration constant PLUG_DOES_MIDI_OUT.'
                    }
                    validationKey={'midiOut'}
                    validationErrors={props.validationErrors}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMidiOut}
                        selectedValue={props.midiOut ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </WorkspaceAttributeFormGroup>

                <WorkspaceAttributeFormGroup
                    label="MPE"
                    inline={true}
                    helperText={
                        'If the plugin uses MPE (MIDI Polyphonic Expression). This value represents the iPlug configuration constant PLUG_DOES_MPE.'
                    }
                    validationKey={'mpe'}
                    validationErrors={props.validationErrors}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setMpe}
                        selectedValue={props.mpe ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </WorkspaceAttributeFormGroup>

                <WorkspaceAttributeFormGroup
                    label="State Chunks"
                    inline={true}
                    helperText={
                        'If the plugin needs to receive state as chunks of memory. This value represents the iPlug configuration constant PLUG_DOES_STATE_CHUNKS.'
                    }
                    validationKey={'stateChunks'}
                    validationErrors={props.validationErrors}
                >
                    <RadioGroup
                        inline={true}
                        onChange={setStateChunks}
                        selectedValue={props.stateChunks ? 'yes' : 'no'}
                    >
                        <Radio label="Yes" value="yes" />
                        <Radio label="No" value="no" />
                    </RadioGroup>
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default InputOutputPanel;
