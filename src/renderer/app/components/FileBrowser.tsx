import { When } from '@/renderer/app/components/When';
import {
    Button,
    ButtonGroup,
    Card,
    ContextMenu,
    ITreeNode,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    Tree,
} from '@blueprintjs/core';
import { ELEVATION_2 } from '@blueprintjs/core/lib/esm/common/classes';
import { IconName } from '@blueprintjs/icons';
import {
    ADD,
    CLEAN,
    FONT,
    HEADER,
    IMPORT,
    MEDIA,
} from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as path from 'path';
import * as React from 'react';

export interface FileBrowserProps {
    fileList: string[];
    selectedFile: string | undefined;
    onSelectFile: (fileName: string) => void;
    onImportExistingItem: () => void;
    onCreateNewItem?: () => void;
    onDelete: (fileName: string) => void;
    onOpenInExternalEditor: (fileName: string) => void;
    onLocateFileInExplorer: (fileName: string) => void;
    onRenameFile: (fileName: string) => void;
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

    onSelectFile = (node: ITreeNode<string>) => {
        this.props.onSelectFile(node.id as string);
    };

    showContextMenu = (
        node: ITreeNode<string>,
        nodePath: number[],
        e: React.MouseEvent<HTMLElement>,
    ) => {
        const fileName = node.nodeData!;

        this.onSelectFile(node);

        const onOpenExternalEditorButtonClicked = () => {
            this.props.onOpenInExternalEditor(fileName);
        };

        const onOpenContainingDirectoryButtonClicked = () => {
            this.props.onLocateFileInExplorer(fileName);
        };

        const onRenameButtonClicked = () => {
            this.props.onRenameFile(fileName);
        };

        const onDeleteButtonClicked = () => {
            this.props.onDelete(fileName);
        };

        ContextMenu.show(
            <Menu>
                <MenuItem
                    icon="application"
                    text="Open in external editor"
                    onClick={onOpenExternalEditorButtonClicked}
                />
                <MenuItem
                    icon="add-to-folder"
                    text="Open containing directory"
                    onClick={onOpenContainingDirectoryButtonClicked}
                />
                <MenuItem icon="translate" text="Rename" onClick={onRenameButtonClicked} />
                <MenuDivider />
                <MenuItem icon="trash" text="Delete" onClick={onDeleteButtonClicked} />
            </Menu>,
            { left: e.clientX, top: e.clientY },
        );
    };

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
                            onNodeContextMenu={this.showContextMenu}
                            contents={this.props.fileList.map((fileName) => {
                                return {
                                    id: fileName,
                                    hasCaret: false,
                                    icon: this.getIconForFileName(fileName),
                                    label: fileName,
                                    nodeData: fileName,
                                    isSelected: fileName === this.props.selectedFile,
                                } as ITreeNode;
                            })}
                            onNodeClick={this.onSelectFile}
                        />
                    </Card>
                </div>
                <div className="right-column viewer-container">
                    <When condition={this.props.showContentArea}>
                        <Card className={`${ELEVATION_2} full-width no-padding`}>
                            {this.props.children}
                        </Card>
                    </When>
                </div>
            </div>
        );
    }
}
