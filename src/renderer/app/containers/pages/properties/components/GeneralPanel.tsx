import { SelectInput } from '@/renderer/app/components/SelectInput';
import { PluginFormat, Prototype } from '@/renderer/app/model/workspace-config';
import { enumEntries, enumValues } from '@/renderer/app/util/type-utils';
import { Card, Checkbox, Divider, Elevation, FormGroup, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface GeneralPanelProps {
    projectName: string;
    setProjectName: (value: string) => void;
    prototype: Prototype;
    setPrototype: (value: Prototype) => void;
    version: string;
    setVersion: (value: string) => void;
}

const GeneralPanel = (props: GeneralPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Project</H5>
            <Divider />
            <div className="tab-page-card-content">
                <FormGroup label="Plug-In name" labelFor="text-input" inline={true}>
                    <InputGroup
                        placeholder="Please enter the name of the plug-in"
                        value={props.projectName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setProjectName(e.target.value)
                        }
                    />
                </FormGroup>
                <FormGroup label="Prototype" labelFor="prototype-input" inline={true}>
                    <SelectInput
                        items={enumValues(Prototype).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.prototype}
                        onClick={(item) => props.setPrototype(item.key)}
                    />
                </FormGroup>
                <FormGroup label="Version" labelFor="text-input" inline={true}>
                    <InputGroup
                        placeholder="Please enter the name of the plug-in"
                        value={props.version}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            props.setVersion(e.target.value)
                        }
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default GeneralPanel;
