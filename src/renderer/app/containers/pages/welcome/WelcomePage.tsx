import { SelectInput } from '@/renderer/app/components/SelectInput';
import { When } from '@/renderer/app/components/When';
import {
    ActionsPanel,
    ActionsPanelProps,
} from '@/renderer/app/containers/pages/welcome/components/ActionsPanel';
import { IPlugPluginType } from '@/renderer/app/model/workspace-config';
import { showWarningNotification } from '@/renderer/app/services/ui/notification-service';
import { AppStore } from '@/renderer/app/stores/app-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { enumValues } from '@/renderer/app/util/type-utils';
import {
    Button,
    Card,
    Divider,
    FormGroup,
    H6,
    Icon,
    InputGroup,
    ITreeNode,
    PanelStack,
    Popover,
    Tooltip,
    Tree,
} from '@blueprintjs/core';
import { DOCUMENT_OPEN, TRASH } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

const WelcomePage = (props: { appStore?: AppStore; workspaceStore?: WorkspaceStore }) => {
    const onNodeClick = (node: ITreeNode) => {
        return props.workspaceStore!.openWorkspaceFromPath(node.id as string);
    };

    return (
        <div className="WelcomePage">
            <Card>
                <PanelStack
                    className="panels-container"
                    showPanelHeader={false}
                    initialPanel={{
                        component: ActionsPanel,
                        props: {
                            onCreateWorkspace: props.workspaceStore!.initializeWorkspace,
                            openConfigFromDialog: props.workspaceStore!.openWorkspaceFromDialog,
                        } as ActionsPanelProps,
                    }}
                />
                <When condition={props.workspaceStore!.recentlyOpenedWorkspaces.length > 0}>
                    <Divider />
                    <div className="recent-files-section">
                        <H6>Recent Projects</H6>
                        <Tree
                            contents={props.workspaceStore!.recentlyOpenedWorkspaces.map(
                                (metadata) => {
                                    const onDeleteButtonClicked = (
                                        e: React.MouseEvent<HTMLElement>,
                                    ) => {
                                        props.workspaceStore!.deregisterRecentlyOpenedWorkspace(
                                            metadata.filePath,
                                        );
                                        e.stopPropagation();
                                    };

                                    return {
                                        id: metadata.filePath,
                                        hasCaret: false,
                                        icon: DOCUMENT_OPEN,
                                        label: (
                                            <Popover position={'top'}>
                                                <Tooltip content={metadata.filePath}>
                                                    {metadata.projectName}
                                                </Tooltip>
                                            </Popover>
                                        ),
                                        secondaryLabel: (
                                            <div>
                                                <Button
                                                    small={true}
                                                    minimal={true}
                                                    icon={TRASH}
                                                    onClick={onDeleteButtonClicked}
                                                />
                                            </div>
                                        ),
                                    } as ITreeNode;
                                },
                            )}
                            onNodeClick={onNodeClick}
                        />
                    </div>
                </When>
            </Card>
        </div>
    );
};

export default inject('appStore', 'workspaceStore')(observer(WelcomePage));
