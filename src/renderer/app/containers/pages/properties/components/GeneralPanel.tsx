import * as React from 'react';
import {Card, Checkbox, Divider, Elevation, FormGroup, H5, InputGroup} from "@blueprintjs/core";
import {PluginFormat, Prototype} from "@/renderer/app/model/workspace-config";
import {SelectInput} from "@/renderer/app/components/SelectInput";
import {enumEntries, enumValues} from "@/renderer/app/util/type-utils";

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
                    <InputGroup placeholder="Please enter the name of the plug-in"
                                value={props.version}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setVersion(e.target.value)}/>
                </FormGroup>
                <FormGroup className='right-column' label="Formats" labelFor="text-input">
                    {enumEntries(PluginFormat).map(([key, format]) => {
                        return (
                            <Checkbox label={format.toString()} inline={true} key={format}
                                      checked={props.formats.includes(format)}
                                      onChange={() => props.formats.includes(format) ?
                                          props.setFormats(props.formats.filter(e => e != format)) :
                                          props.setFormats([...props.formats, format])
                                      }
                            />
                        );
                    })}
                </FormGroup>
            </div>
        </Card>
    );
};

export default GeneralPanel;
