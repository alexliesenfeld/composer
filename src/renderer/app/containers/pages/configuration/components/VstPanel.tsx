import { SelectInput, SelectInputItem } from '@/renderer/app/components/SelectInput';
import { Vst3Subcategory } from '@/renderer/app/model/workspace-config';
import { enumValues } from '@/renderer/app/util/type-utils';
import { Card, Divider, Elevation, FormGroup, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface VstPanelProps {
    vst3Subcategory: Vst3Subcategory;
    setVst3Subcategory: (value: Vst3Subcategory) => void;
    vst3UniqueId: string;
    setVst3UniqueId: (value: string) => void;
    vst3SdkGitSha: string;
    setVst3SdkGitSha: (value: string) => void;
}

const VstPanel = (props: VstPanelProps) => {
    const setVst3UniqueId = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVst3UniqueId(e.target.value);
    };

    const setVst3Subcategory = (item: SelectInputItem<Vst3Subcategory>) => {
        props.setVst3Subcategory(item.key);
    };

    const setVst3SdkGitSha = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVst3SdkGitSha(e.target.value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Virtual Studio Technology (VST)</H5>
            <Divider />
            <div className="card-content">
                <FormGroup label="Unique Plug-In ID" labelFor="text-input" inline={true}  helperText={'The unique VST plugin ID.'}>
                    <InputGroup
                        value={props.vst3UniqueId}
                        onChange={setVst3UniqueId}
                    />
                </FormGroup>
                <FormGroup label="Subcategory" labelFor="text-input" inline={true} helperText={'The VST3 subcategory of the plugin.'}>
                    <SelectInput
                        items={enumValues(Vst3Subcategory).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.vst3Subcategory}
                        onClick={setVst3Subcategory}
                    />
                </FormGroup>
                <FormGroup label="SDK Github Hash" labelFor="text-input" inline={true} helperText={'The SHA1 Git hash that will be cloned from Github to retrieve the VST3 SDK. You need to provide the full hash with 40 characters.'}>
                    <InputGroup
                        value={props.vst3SdkGitSha}
                        onChange={setVst3SdkGitSha}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default VstPanel;
