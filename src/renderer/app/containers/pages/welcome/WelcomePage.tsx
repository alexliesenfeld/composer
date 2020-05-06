import { When } from '@/renderer/app/components/When';
import { AppStore } from '@/renderer/app/stores/app-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { Button, Card, Divider, H6, Icon, ITreeNode, Popover, Tooltip, Tree } from '@blueprintjs/core';
import { DOCUMENT_OPEN, LAYERS, NEW_OBJECT, TRASH } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

const WelcomePage = (props: { appStore?: AppStore; workspaceStore?: WorkspaceStore }) => {
    const addRecentlyOpenedProject = () => {
        if (props.workspaceStore!.configPath) {
            props.appStore!.addRecentlyOpenedProject(
                props.workspaceStore!.userConfig!.projectName,
                props.workspaceStore!.configPath,
            );
        }
    };

    return (
        <div className="WelcomePage">
            <Card>
                <div className="welcome-section">
                    <Icon icon={LAYERS} iconSize={50} />
                    <h3>Welcome to Composer!</h3>
                    <Button
                        icon={NEW_OBJECT}
                        fill={true}
                        onClick={() => {
                            props.workspaceStore!.createNewUserConfig().then(addRecentlyOpenedProject);
                        }}
                        intent={'primary'}
                    >
                        New Project
                    </Button>
                    <Button
                        icon={DOCUMENT_OPEN}
                        fill={true}
                        onClick={() => {
                            props.workspaceStore!.openConfigFromDialog().then(addRecentlyOpenedProject);
                        }}
                        intent={'warning'}
                    >
                        Open Project
                    </Button>
                </div>
                <When condition={props.appStore!.recentlyOpenedProjects.length > 0}>
                    <Divider />
                    <div className="recent-files-section">
                        <H6>Recent Projects</H6>
                        <Tree
                            contents={props.appStore!.recentlyOpenedProjects.map((metadata) => {
                                return {
                                    id: metadata.filePath,
                                    hasCaret: false,
                                    icon: DOCUMENT_OPEN,
                                    label: (
                                        <Popover position={'top'}>
                                            <Tooltip content={metadata.filePath}>{metadata.projectName}</Tooltip>
                                        </Popover>
                                    ),
                                    secondaryLabel: (
                                        <div>
                                            <Button
                                                small={true}
                                                minimal={true}
                                                icon={TRASH}
                                                onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                    props.appStore!.removeRecentlyOpenedProject(metadata.filePath);
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>
                                    ),
                                } as ITreeNode;
                            })}
                            onNodeClick={(node) => {
                                props.workspaceStore!.loadConfigFromPathUi(node.id as string);
                            }}
                        />
                    </div>
                </When>
            </Card>
        </div>
    );
};

export default inject('appStore', 'workspaceStore')(observer(WelcomePage));
