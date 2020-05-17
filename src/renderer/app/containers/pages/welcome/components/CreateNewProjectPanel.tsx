import { SelectInput, SelectInputItem } from '@/renderer/app/components/SelectInput';
import { ElectronFileInput } from '@/renderer/app/containers/common/ElectronFileInput';

import { IPlugPluginType } from '@/renderer/app/model/workspace-config';
import { enumValues } from '@/renderer/app/util/type-utils';

import { Button, ButtonGroup, FormGroup, H5, InputGroup, IPanelProps } from '@blueprintjs/core';
import { NEW_OBJECT, TRASH } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';
import { useState } from 'react';

export interface CreateProjectPanelProps {
    onCreateWorkspace: (
        projectName: string,
        pluginType: IPlugPluginType,
        projectLocation: string | undefined,
    ) => void;
}

export const CreateNewProjectPanel = (props: CreateProjectPanelProps & IPanelProps) => {
    const [projectName, setProjectName] = useState<string>('MyAudioPlugin');
    const [pluginType, setPluginType] = useState<IPlugPluginType>(IPlugPluginType.EFFECT);
    const [projectLocation, setProjectLocation] = useState<string | undefined>(undefined);

    const setProjectNameUi = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    };

    const setPluginTypeUi = (item: SelectInputItem<IPlugPluginType>) => {
        setPluginType(item.key);
    };

    const onCreateWorkspaceUi = () => {
        props.onCreateWorkspace(projectName, pluginType, projectLocation);
    };

    return (
        <div className="create-new-project-panel">
            <H5>New Project</H5>
            <FormGroup label="Plugin Name" labelFor="text-input">
                <InputGroup
                    placeholder="Please enter the name of the plugin"
                    value={projectName}
                    onChange={setProjectNameUi}
                />
            </FormGroup>
            <FormGroup label="Plugin Type" labelFor="plugin-input">
                <SelectInput
                    items={enumValues(IPlugPluginType).map((e) => ({
                        key: e,
                        text: e,
                    }))}
                    selectedItemKey={pluginType}
                    onClick={setPluginTypeUi}
                />
            </FormGroup>
            <FormGroup label="Project Directory" labelFor="plugin-input">
                <ElectronFileInput
                    text={
                        !!projectLocation
                            ? projectLocation
                            : 'Please select a project directory ...'
                    }
                    buttonText={'Browse'}
                    hasSelection={!!projectLocation}
                    onValueSelected={setProjectLocation}
                    select={'directory'}
                />
            </FormGroup>

            <ButtonGroup fill={true}>
                <Button icon={TRASH} fill={true} onClick={props.closePanel} intent={'none'}>
                    Cancel
                </Button>
                <Button
                    icon={NEW_OBJECT}
                    fill={true}
                    onClick={onCreateWorkspaceUi}
                    intent={'success'}
                >
                    Create
                </Button>
            </ButtonGroup>
        </div>
    );
};
