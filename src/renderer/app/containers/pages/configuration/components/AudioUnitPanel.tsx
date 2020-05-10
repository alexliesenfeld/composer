import { SelectInput } from '@/renderer/app/components/SelectInput';
import { IPlugPluginType } from '@/renderer/app/model/workspace-config';
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
}

const AudioUnitPanel = (props: AudioUnitPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Audio Unit (AU)</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Bundle Name"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The bundle name that will be used for Xcode projects. This value represents the iPlug configuration constant BUNDLE_NAME.'
                    }
                >
                    <InputGroup
                        id="text-input"
                        value={props.bundleName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleName(e.target.value)
                        }
                    />
                </FormGroup>
                <FormGroup
                    label="Bundle Manufacturer"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The bundle manufacturer that will be used for Xcode projects. This value represents the iPlug configuration constant BUNDLE_MFR.'
                    }
                >
                    <InputGroup
                        id="text-input"
                        value={props.bundleManufacturer}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleManufacturer(e.target.value)
                        }
                    />
                </FormGroup>

                <FormGroup
                    label="Bundle Domain"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The bundle domain that will be used for Xcode projects. This value represents the iPlug configuration constant BUNDLE_DOMAIN.'
                    }
                >
                    <InputGroup
                        id="text-input"
                        value={props.bundleDomain}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setBundleDomain(e.target.value)
                        }
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default AudioUnitPanel;
