import { WorkspaceAttributeFormGroup } from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { Card, Divider, Elevation, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface ManufacturerPanelProps {
    manufacturerName: string;
    setManufacturerName: (value: string) => void;
    manufacturerId: string;
    setManufacturerId: (value: string) => void;
    manufacturerEmail: string;
    setManufacturerEmail: (value: string) => void;
    manufacturerCopyrightNotice: string;
    setManufacturerCopyrightNotice: (value: string) => void;
    manufacturerWebsite: string;
    setManufacturerWebsite: (value: string) => void;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
}

const ManufacturerPanel = (props: ManufacturerPanelProps) => {
    const setManufacturerName = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setManufacturerName(e.target.value);
    };

    const setManufacturerId = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setManufacturerId(e.target.value);
    };

    const setManufacturerEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setManufacturerEmail(e.target.value);
    };

    const setManufacturerCopyrightNotice = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setManufacturerCopyrightNotice(e.target.value);
    };

    const setManufacturerWebsite = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setManufacturerWebsite(e.target.value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Manufacturer</H5>
            <Divider />
            <div className="card-content">
                <WorkspaceAttributeFormGroup
                    label="Name"
                    inline={true}
                    helperText={`The name of the manufacturer. It must not contain spaces. This value represents the iPlug configuration constant PLUG_MFR.`}
                    validationKey={'manufacturerName'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.manufacturerName}
                        onChange={setManufacturerName}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Unique ID"
                    inline={true}
                    helperText={`A unique four character manufacturer ID. This value represents the iPlug configuration constant PLUG_MFR_ID.`}
                    validationKey={'manufacturerId'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="manufacturer-id"
                        value={props.manufacturerId}
                        onChange={setManufacturerId}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="E-Mail"
                    inline={true}
                    helperText={`The email address of the manufacturer. This field is optional. This value represents the iPlug configuration constant PLUG_EMAIL_STR.`}
                    validationKey={'manufacturerEmail'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.manufacturerEmail}
                        onChange={setManufacturerEmail}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Copyright"
                    inline={true}
                    helperText={`The copyright notice of the manufacturer. This field is optional. This value represents the iPlug configuration constant PLUG_COPYRIGHT_STR.`}
                    validationKey={'manufacturerCopyrightNotice'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.manufacturerCopyrightNotice}
                        onChange={setManufacturerCopyrightNotice}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="Website"
                    inline={true}
                    helperText={`The manufacturer or product website URL. This field is optional. This value represents the iPlug configuration constant PLUG_URL_STR.`}
                    validationKey={'manufacturerWebsite'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup
                        id="text-input"
                        value={props.manufacturerWebsite}
                        onChange={setManufacturerWebsite}
                    />
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default ManufacturerPanel;
