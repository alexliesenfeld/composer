import { SelectInput, SelectInputItem } from '@/renderer/app/components/SelectInput';
import {WorkspaceAttributeFormGroup} from '@/renderer/app/components/WorkspaceAttributeFormGroup';
import {ValidationErrors} from '@/renderer/app/model/validation';
import { Vst3Subcategory } from '@/renderer/app/model/workspace-config';
import {WorkspaceConfigKey} from '@/renderer/app/services/domain/config-validator';
import { enumValues } from '@/renderer/app/util/type-utils';
import { Card, Divider, Elevation, FormGroup, H5, InputGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface VstPanelProps {
    vst3Subcategory: Vst3Subcategory;
    setVst3Subcategory: (value: Vst3Subcategory) => void;
    vst3SdkGitHash: string;
    setVst3SdkGitHash: (value: string) => void;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
}

const VstPanel = (props: VstPanelProps) => {
    const setVst3Subcategory = (item: SelectInputItem<Vst3Subcategory>) => {
        props.setVst3Subcategory(item.key);
    };

    const setVst3SdkGitSha = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVst3SdkGitHash(e.target.value);
    };

    return (
        <Card elevation={Elevation.TWO}>
            <H5>Virtual Studio Technology (VST)</H5>
            <Divider />
            <div className="card-content">
                <WorkspaceAttributeFormGroup
                    label="Subcategory"
                    inline={true}
                    helperText={
                        'The VST3 subcategory of the plugin. This value represents the iPlug configuration constant VST3_SUBCATEGORY.'
                    }
                    validationKey={'vst3Subcategory'}
                    validationErrors={props.validationErrors}
                >
                    <SelectInput
                        items={enumValues(Vst3Subcategory).map((e) => ({
                            key: e,
                            text: e,
                        }))}
                        selectedItemKey={props.vst3Subcategory}
                        onClick={setVst3Subcategory}
                    />
                </WorkspaceAttributeFormGroup>
                <WorkspaceAttributeFormGroup
                    label="SDK Github Hash"
                    inline={true}
                    helperText={
                        'The SHA1 Git hash that will be cloned from Github to retrieve the VST3 SDK. You need to provide the full hash with 40 characters.'
                    }
                    validationKey={'vst3SdkGitHash'}
                    validationErrors={props.validationErrors}
                >
                    <InputGroup value={props.vst3SdkGitHash} onChange={setVst3SdkGitSha} />
                </WorkspaceAttributeFormGroup>
            </div>
        </Card>
    );
};

export default VstPanel;
