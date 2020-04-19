import * as React from 'react';
import {Card, Checkbox, Divider, Elevation, FormGroup, H5, InputGroup} from "@blueprintjs/core";
import {PluginFormat, Prototype} from "@/lib/model/user-config";
import {SelectInput} from "@/renderer/app/support/components/SelectInput";
import {enumValues} from "@/renderer/app/support/util/enum-utils";

export interface GeneralPanelProps {
    projectName: string,
    setProjectName: (value: string) => void,
    prototype: Prototype,
    setPrototype: (value: Prototype) => void,
    version: string,
    setVersion: (value: string) => void,
    formats: PluginFormat[],
    setFormats: (value: PluginFormat[]) => void,
}

const GeneralPanel = (props: GeneralPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <input value={new Date().toString()}/>
            <H5>General</H5>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Plug-In name" labelFor="text-input">
                    <InputGroup placeholder="Please enter the name of the plug-in"
                                value={props.projectName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setProjectName(e.target.value)}/>
                </FormGroup>
                <FormGroup className='right-column' label="Prototype" labelFor="prototype-input">
                    <SelectInput items={enumValues(Prototype).map((e) => ({key: e, text: e}))}
                                 selectedItemKey={props.prototype}
                                 onClick={(item) => props.setPrototype(item.key)}/>
                </FormGroup>
            </div>
            <div className='row'>
                <FormGroup className='left-column' label="Version" labelFor="text-input">
                    <InputGroup id="text-input" placeholder="Please enter the version of the plug-in"/>
                </FormGroup>
                <FormGroup className='right-column' label="Formats" labelFor="text-input">
                    <Checkbox label="VST2" inline={true}/>
                    <Checkbox label="VST3" inline={true}/>
                    <Checkbox label="AU2" inline={true}/>
                    <Checkbox label="AAX" inline={true}/>
                    <Checkbox label="iOS" inline={true}/>
                </FormGroup>
            </div>
        </Card>
    );
};

export default React.memo(GeneralPanel);
