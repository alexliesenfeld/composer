import { WorkspaceAttributeFormGroup } from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { Card, Divider, Elevation, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface MacOsPanelProps {
    bundleName: string;
    setBundleName: (value: string) => void;
    bundleManufacturer: string;
    setBundleManufacturer: (value: string) => void;
    bundleDomain: string;
    setBundleDomain: (value: string) => void;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
}

const MacOsPanel = (props: MacOsPanelProps) => {
    const setBundleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setBundleName(e.target.value);
    };

    const setBundleManufacturer = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setBundleManufacturer(e.target.value);
    };

    const setBundleDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setBundleDomain(e.target.value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>macOS</H5>
            {/* and iOS later */}
            <Divider />
            <div className="card-content">
                <WorkspaceAttributeFormGroup
                    label="Bundle Name"
                    inline={true}
                    helperText={`The product name part of the plugin's bundle ID. This value represents the iPlug configuration constant BUNDLE_NAME.`}
                    validationKey={'macOsBundleName'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup id="text-input" value={props.bundleName} onChange={setBundleName} />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Bundle Manufacturer"
                    inline={true}
                    helperText={`The manufacturer name part of the plugin's bundle ID. This value represents the iPlug configuration constant BUNDLE_MFR.`}
                    validationKey={'macOsBundleManufacturer'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.bundleManufacturer}
                        onChange={setBundleManufacturer}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Bundle Domain"
                    inline={true}
                    helperText={`The domain name part of the plugin's bundle ID. This value represents the iPlug configuration constant BUNDLE_DOMAIN.`}
                    validationKey={'macOsBundleDomain'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.bundleDomain}
                        onChange={setBundleDomain}
                    />
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default MacOsPanel;
