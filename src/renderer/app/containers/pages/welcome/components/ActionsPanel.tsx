import {
    CreateNewProjectPanel,
    CreateProjectPanelProps,
} from '@/renderer/app/containers/pages/welcome/components/CreateNewProjectPanel';
import { ElectronContext } from '@/renderer/app/model/electron-context';
import { IPlugPluginType } from '@/renderer/app/model/workspace-config';

import { Button, ButtonGroup, Icon, IPanelProps, Text } from '@blueprintjs/core';
import {
    DOCUMENT_OPEN,
    LAYERS,
    LIGHTBULB,
    NEW_OBJECT,
    SHARE,
} from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';

export interface ActionsPanelProps {
    onCreateWorkspace: (
        projectName: string,
        pluginType: IPlugPluginType,
        projectLocation: string | undefined,
    ) => void;
    openConfigFromDialog: () => void;
}

export const ActionsPanel = (props: ActionsPanelProps & IPanelProps) => {
    const openSettingsPanel = () => {
        props.openPanel({
            component: CreateNewProjectPanel,
            props: {
                onCreateWorkspace: props.onCreateWorkspace,
            } as CreateProjectPanelProps,
            title: 'Settings',
        });
    };

    const openProjectWebsite = async () => {
        return ElectronContext.openUrlInExternalBrowser(
            'https://github.com/alexliesenfeld/composer',
        );
    };

    const openBugTrackerWebsite = async () => {
        return ElectronContext.openUrlInExternalBrowser(
            'https://github.com/alexliesenfeld/composer/issues',
        );
    };

    return (
        <div className="actions-panel">
            <div onClick={openProjectWebsite} className="logo-container">
                <Icon icon={LAYERS} iconSize={60} />
                <h3>Welcome to Composer!</h3>
            </div>
            <Text>Version: {ElectronContext.getAppVersion()}</Text>
            <div className="buttons-container">
                <Button
                    icon={NEW_OBJECT}
                    fill={true}
                    onClick={openSettingsPanel /*props.createNewUserConfig*/}
                    intent={'primary'}
                >
                    New Project
                </Button>
                <Button
                    icon={DOCUMENT_OPEN}
                    fill={true}
                    onClick={props.openConfigFromDialog}
                    intent={'warning'}
                >
                    Open Project
                </Button>
            </div>
            <div className="link-buttons-container">
                <ButtonGroup fill={true} minimal={true}>
                    <Button
                        fill={true}
                        icon={SHARE}
                        onClick={openProjectWebsite}
                        className="muted-button"
                    >
                        Project Website
                    </Button>
                    <Button
                        fill={true}
                        icon={LIGHTBULB}
                        onClick={openBugTrackerWebsite}
                        className="muted-button"
                    >
                        Report Issue
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};
