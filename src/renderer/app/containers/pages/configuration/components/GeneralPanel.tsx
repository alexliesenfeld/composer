import { SelectInput, SelectInputItem } from '@/renderer/app/components/SelectInput';
import { Prototype } from '@/renderer/app/model/workspace-config';
import { enumValues } from '@/renderer/app/util/type-utils';
import {
    Card,
    Divider,
    Elevation,
    FormGroup,
    H5,
    Icon,
    InputGroup,
    Popover,
    Text,
} from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';

import * as React from 'react';

export interface GeneralPanelProps {
    projectName: string;
    setProjectName: (value: string) => void;
    prototype: Prototype;
    setPrototype: (value: Prototype) => void;
    version: string;
    setVersion: (value: string) => void;
    iPlugSha1: string;
    setIPlugSha1: (value: string) => void;
}

const GeneralPanel = (props: GeneralPanelProps) => {
    const setProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setProjectName(e.target.value);
    };

    const setPrototype = (item: SelectInputItem<Prototype>) => {
        props.setPrototype(item.key);
    };

    const setVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVersion(e.target.value);
    };

    const setIPlugSha1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setIPlugSha1(e.target.value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>General</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Plug-In name"
                    labelFor="text-input"
                    inline={true}
                    helperText={'The Plugin name. It must not contain spaces.'}
                >
                    <InputGroup
                        placeholder="Please enter the name of the plug-in"
                        value={props.projectName}
                        onChange={setProjectName}
                    />
                </FormGroup>
                <FormGroup
                    label="Prototype"
                    labelFor="prototype-input"
                    inline={true}
                    helperText={
                        'This value represents the base project from the iPlug examples directory that will be used to generate the foundation for IDE projects.'
                    }
                >
                    <SelectInput
                        items={enumValues(Prototype).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.prototype}
                        onClick={setPrototype}
                    />
                </FormGroup>
                <FormGroup
                    label="Version"
                    labelFor="text-input"
                    inline={true}
                    helperText={`The Plugin version number. It's of the form "major.minor.patch".`}
                >
                    <InputGroup
                        placeholder="Please enter the name of the plug-in"
                        value={props.version}
                        onChange={setVersion}
                    />
                </FormGroup>
                <FormGroup
                    label="iPlug2 Github Hash"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The SHA1 Git hash that will be cloned from Github to generate IDE projects. You need to provide the full hash with 40 characters.'
                    }
                >
                    <InputGroup
                        placeholder="Please enter the version of iPlug2 to use"
                        value={props.iPlugSha1}
                        onChange={setIPlugSha1}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default GeneralPanel;
