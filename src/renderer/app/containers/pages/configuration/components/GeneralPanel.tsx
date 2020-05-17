import { SelectInput, SelectInputItem } from '@/renderer/app/components/SelectInput';
import { IPlugPluginType, PluginFormat } from '@/renderer/app/model/workspace-config';
import { enumValues } from '@/renderer/app/util/type-utils';
import { Card, Checkbox, Divider, Elevation, FormGroup, H5, InputGroup } from '@blueprintjs/core';
import { useState } from 'react';

import * as React from 'react';

export interface GeneralPanelProps {
    projectName: string;
    setProjectName: (value: string) => void;
    version: string;
    setVersion: (value: string) => void;
    iPlugSha1: string;
    setIPlugSha1: (value: string) => void;
    mainClassName: string;
    setMainClassName: (value: string) => void;
    vst3UniqueId: string;
    setVst3UniqueId: (value: string) => void;
    pluginType: IPlugPluginType;
    setPluginType: (value: IPlugPluginType) => void;
    formats: PluginFormat[];
    setFormats: (value: PluginFormat[]) => void;
}

const GeneralPanel = (props: GeneralPanelProps) => {
    const availablePluginFormats: PluginFormat[] = [
        PluginFormat.VST3,
        PluginFormat.APP,
        PluginFormat.AU2,
    ];

    const setProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setProjectName(e.target.value);
    };

    const setMainClassName = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setMainClassName(e.target.value);
    };

    const setVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVersion(e.target.value);
    };

    const setIPlugSha1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setIPlugSha1(e.target.value);
    };

    const setVst3UniqueId = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVst3UniqueId(e.target.value);
    };

    const setPluginType = (item: SelectInputItem<IPlugPluginType>) => {
        props.setPluginType(item.key);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>General</H5>
            <Divider />
            <div className="card-content">
                <FormGroup
                    label="Plugin Name"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The plugin name. It must not contain spaces. This value represents the iPlug configuration constant PLUG_NAME.'
                    }
                >
                    <InputGroup
                        placeholder="Please enter the name of the plugin"
                        value={props.projectName}
                        onChange={setProjectName}
                    />
                </FormGroup>
                <FormGroup
                    label="Plugin Type"
                    labelFor="plugin-input"
                    inline={true}
                    helperText={
                        'The plugin type. This value represents the iPlug configuration constant PLUG_TYPE.'
                    }
                >
                    <SelectInput
                        items={enumValues(IPlugPluginType).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.pluginType}
                        onClick={setPluginType}
                    />
                </FormGroup>
                <FormGroup
                    label="Version"
                    labelFor="text-input"
                    inline={true}
                    helperText={`The Plugin version number. It's of the form "major.minor.patch". This value represents the iPlug configuration constant PLUG_VERSION_STR and PLUG_VERSION_HEX.`}
                >
                    <InputGroup
                        placeholder="Please enter the name of the plugin"
                        value={props.version}
                        onChange={setVersion}
                    />
                </FormGroup>
                <FormGroup
                    label="Unique ID"
                    labelFor="text-input"
                    inline={true}
                    helperText={`Your unique plugin ID. This value needs to consist of four characters. Example: IPeF. This value represents the iPlug configuration constant PLUG_UNIQUE_ID.`}
                >
                    <InputGroup value={props.vst3UniqueId} onChange={setVst3UniqueId} />
                </FormGroup>
                <FormGroup
                    label="Formats"
                    labelFor="text-input"
                    inline={true}
                    helperText={'The plugin formats that will be available.'}
                >
                    {availablePluginFormats.map((format) => {
                        const onSelectFormat = () => {
                            props.formats.includes(format)
                                ? props.setFormats(props.formats.filter((e) => e != format))
                                : props.setFormats([...props.formats, format]);
                        };
                        return (
                            <Checkbox
                                label={format.toString()}
                                inline={true}
                                key={format}
                                checked={props.formats.includes(format)}
                                onChange={onSelectFormat}
                            />
                        );
                    })}
                </FormGroup>
                <FormGroup
                    label="Main Class"
                    labelFor="text-input"
                    inline={true}
                    helperText={
                        'The main C++ class of this plugin. You need to have this class defined somewhere in your code, otherwise it will not compile. This value represents the iPlug configuration constant PLUG_CLASS_NAME.'
                    }
                >
                    <InputGroup
                        placeholder="Please enter the name of the main C++ class"
                        value={props.mainClassName}
                        onChange={setMainClassName}
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
