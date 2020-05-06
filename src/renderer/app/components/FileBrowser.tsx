import { When } from '@/renderer/app/components/When';
import { Button, ButtonGroup, Card, ITreeNode, Navbar, Tree } from '@blueprintjs/core';
import { ELEVATION_2 } from '@blueprintjs/core/lib/esm/common/classes';
import { IconName } from '@blueprintjs/icons';
import { ADD, CLEAN, FONT, HEADER, IMPORT, MEDIA, TRASH } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as path from 'path';
import * as React from 'react';

export interface FileBrowserProps {
    fileList: string[];
    selectedFile: string | undefined;
    onSelectFile: (fileName: string) => void;
    onImportExistingItem: () => void;
    onCreateNewItem?: () => void;
    onDelete: (fileName: string) => void;
    showContentArea: boolean;
    className?: string;
}

export class FileBrowser extends React.Component<FileBrowserProps> {
    getIconForFileName(fileName: string): IconName | undefined {
        switch (path.extname(fileName)) {
            case '.h':
            case '.hpp':
                return HEADER;
            case '.cpp':
                return CLEAN;
            case '.ttf':
                return FONT;
            case '.png':
                return MEDIA;
            default:
                return undefined;
        }
    }

    render() {
        return (
            <div className={`FileBrowser ${this.props.className ? this.props.className : ''}`}>
                <div className="left-column file-list-container">
                    <Card className={`${ELEVATION_2} full-width no-padding`}>
                        <Navbar>
                            <Navbar.Group align={'left'}>
                                <ButtonGroup>
                                    {this.props.onCreateNewItem ? (
                                        <Button
                                            icon={ADD}
                                            small={true}
                                            minimal={true}
                                            onClick={this.props.onCreateNewItem}
                                        >
                                            New
                                        </Button>
                                    ) : null}
                                    <Button
                                        icon={IMPORT}
                                        small={true}
                                        minimal={true}
                                        onClick={this.props.onImportExistingItem}
                                    >
                                        Import
                                    </Button>
                                </ButtonGroup>
                            </Navbar.Group>
                        </Navbar>
                        <Tree
                            className="file-tree"
                            contents={this.props.fileList.map((fileName) => {
                                return {
                                    id: fileName,
                                    hasCaret: false,
                                    icon: this.getIconForFileName(fileName),
                                    label: fileName,
                                    isSelected: fileName === this.props.selectedFile,
                                    secondaryLabel: (
                                        <div>
                                            <Button
                                                small={true}
                                                minimal={true}
                                                icon={TRASH}
                                                onClick={() => this.props.onDelete(fileName)}
                                            />
                                        </div>
                                    ),
                                } as ITreeNode;
                            })}
                            onNodeClick={(node) => this.props.onSelectFile(node.id as string)}
                        />
                    </Card>
                </div>
                <div className="right-column viewer-container">
                    <When condition={this.props.showContentArea}>
                        <Card className={`${ELEVATION_2} full-width no-padding`}>{this.props.children}</Card>
                    </When>
                </div>
            </div>
        );
    }
}
