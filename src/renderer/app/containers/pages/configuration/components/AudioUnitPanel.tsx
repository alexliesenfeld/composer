import { SelectInput } from '@/renderer/app/components/SelectInput';
import { AudioUnitPluginType } from '@/renderer/app/model/workspace-config';
import { enumValues } from '@/renderer/app/util/type-utils';
import { Card, Divider, Elevation, FormGroup, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface AudioUnitPanelProps {
    bundleName: string;
    setBundleName: (value: string) => void;
    bundleManufacturer: string;
    setBundleManufacturer: (value: string) => void;
    bundleDomain: string;
    setBundleDomain: (value: string) => void;
    manufacturerId: string;
    setManufacturerId: (value: string) => void;
    audioUnitPluginType: AudioUnitPluginType;
    setAudioUnitPluginType: (value: AudioUnitPluginType) => void;
}

const AudioUnitPanel = (props: AudioUnitPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Audio Unit (AU)</H5>
            <Divider />
            <div className="card-content">
                <FormGroup label="Bundle Name" labelFor="text-input" inline={true}
                           helperText={'The bundle name that will be used for Xcode projects.'}>
                    <InputGroup
                        id="text-input"
                        placeholder="Please enter the manufacturer name"
                        value={props.bundleName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleName(e.target.value)
                        }
                    />
                </FormGroup>
                <FormGroup label="Bundle Manufacturer" labelFor="text-input" inline={true}
                           helperText={'The bundle manufacturer that will be used for Xcode projects.'}
                >
                    <InputGroup
                        id="text-input"
                        placeholder="Please enter the manufacturer E-Mail address"
                        value={props.bundleManufacturer}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleManufacturer(e.target.value)
                        }
                    />
                </FormGroup>

                <FormGroup label="Bundle Domain" labelFor="text-input" inline={true} helperText={'The bundle domain that will be used for Xcode projects.'}>
                    <InputGroup
                        id="text-input"
                        placeholder="Please enter the manufacturer E-Mail address"
                        value={props.bundleDomain}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleDomain(e.target.value)
                        }
                    />
                </FormGroup>
                <FormGroup inline={true} label="AU Manufacturer ID" labelFor="text-input" helperText={'The AU manufacturer ID.'}>
                    <InputGroup
                        id="text-input"
                        placeholder="Please enter the manufacturer E-Mail address"
                        value={props.manufacturerId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setManufacturerId(e.target.value)
                        }
                    />
                </FormGroup>
                <FormGroup label="Plugin Type" labelFor="plugin-input" inline={true} helperText={'The AU plugin type.'}>
                    <SelectInput
                        items={enumValues(AudioUnitPluginType).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.audioUnitPluginType}
                        onClick={(item) => props.setAudioUnitPluginType(item.key)}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default AudioUnitPanel;
