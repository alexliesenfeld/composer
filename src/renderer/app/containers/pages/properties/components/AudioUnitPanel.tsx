import * as React from 'react';
import {Card, Divider, Elevation, FormGroup, H5, InputGroup} from "@blueprintjs/core";
import {AudioUnitPluginType, Prototype} from "@/renderer/app/model/user-config";
import {SelectInput} from "@/renderer/app/components/SelectInput";
import {enumValues} from "@/renderer/app/util/type-utils";

export interface AudioUnitPanelProps {
    bundleName: string,
    setBundleName: (value: string) => void,
    bundleManufacturer: string,
    setBundleManufacturer: (value: string) => void,
    bundleDomain: string,
    setBundleDomain: (value: string) => void,
    manufacturerId: string,
    setManufacturerId: (value: string) => void,
    audioUnitPluginType: AudioUnitPluginType,
    setAudioUnitPluginType: (value: AudioUnitPluginType) => void,
}

const AudioUnitPanel = (props: AudioUnitPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Audio Unit (AU)</H5>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Bundle Name" labelFor="text-input">
                    <InputGroup id="text-input" placeholder="Please enter the manufacturer name"
                                value={props.bundleName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setBundleName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className='right-column' label="Bundle Manufacturer" labelFor="text-input">
                    <InputGroup id="text-input" placeholder="Please enter the manufacturer E-Mail address"
                                value={props.bundleManufacturer}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setBundleManufacturer(e.target.value)}
                    />
                </FormGroup>
            </div>
            <div className='row'>
                <div className='left-column'>
                    <FormGroup className='left-column' label="Bundle Domain" labelFor="text-input">
                        <InputGroup id="text-input" placeholder="Please enter the manufacturer E-Mail address"
                                    value={props.bundleDomain}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setBundleDomain(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className='right-column' label="AU Manufacturer ID" labelFor="text-input">
                        <InputGroup id="text-input" placeholder="Please enter the manufacturer E-Mail address"
                                    value={props.manufacturerId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setManufacturerId(e.target.value)}
                        />
                    </FormGroup>
                </div>

                <FormGroup className='right-column' label="Prototype" labelFor="prototype-input">
                    <SelectInput items={enumValues(AudioUnitPluginType).map((e) => ({key: e, text: e}))}
                                 selectedItemKey={props.audioUnitPluginType}
                                 onClick={(item) => props.setAudioUnitPluginType(item.key)}/>
                </FormGroup>
            </div>

        </Card>
    );
};

export default AudioUnitPanel;
