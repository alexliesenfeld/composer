import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import { FontViewer } from '@/renderer/app/components/FontViewer';
import { ImageViewer } from '@/renderer/app/components/ImageViewer';
import { When } from '@/renderer/app/components/When';
import { SourceFileTabPage } from '@/renderer/app/containers/pages/files/components/SourceFileTabPage';
import { FontHelpPanel } from '@/renderer/app/containers/pages/files/info-panels/FontHelpPanel';
import { ImageHelpPanel } from '@/renderer/app/containers/pages/files/info-panels/ImageHelpPanel';
import { AppStore } from '@/renderer/app/stores/app-store';
import { FilesStore, FilesTab } from '@/renderer/app/stores/files-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { Alignment, Button, Navbar, Tab, Tabs, Text } from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';

import { inject, observer } from 'mobx-react';
import * as React from 'react';

export interface FilesPageProps {
    workspaceStore?: WorkspaceStore;
    filesStore?: FilesStore;
    appStore?: AppStore;
}
@inject('workspaceStore', 'filesStore', 'appStore')
@observer
export class FilesPage extends React.Component<FilesPageProps> {
    constructor(props: FilesPageProps) {
        super(props);

        // This binding is necessary to make `this` work in callbacks
        // Official recommendation: https://reactjs.org/docs/handling-events.html
        this.setActiveTab = this.setActiveTab.bind(this);
        this.onAcceptCreateSourceFileDialog = this.onAcceptCreateSourceFileDialog.bind(this);
        this.onCancelCreateSourceFileDialog = this.onCancelCreateSourceFileDialog.bind(this);
        this.onConfirmDeleteFileDialog = this.onConfirmDeleteFileDialog.bind(this);
        this.onSourceFileSelected = this.onSourceFileSelected.bind(this);
        this.onCreateNewSourceFile = this.onCreateNewSourceFile.bind(this);
        this.onImportSourceFile = this.onImportSourceFile.bind(this);
        this.onDeleteSourceFile = this.onDeleteSourceFile.bind(this);
    }

    render() {
        const filesStore = this.props.filesStore!;
        const appStore = this.props.appStore!;

        return (
            <div className="FilesPage">
                <Tabs
                    animate={false}
                    large={false}
                    selectedTabId={filesStore.activeTab}
                    onChange={this.setActiveTab}
                >
                    <Tab id={FilesTab.SOURCE_FILES_TAB} title="Source Files" />
                    <Tab id={FilesTab.FONTS_TAB} title="Fonts" />
                    <Tab id={FilesTab.IMAGES_TAB} title="Images" />
                </Tabs>
                <When condition={filesStore.activeTab == FilesTab.SOURCE_FILES_TAB}>
                    <SourceFileTabPage
                        darkTheme={appStore.darkTheme}
                        isCreateFileDialogOpen={filesStore.createNewSourceFileDialogOpened}
                        onAcceptCreateSourceFileDialog={this.onAcceptCreateSourceFileDialog}
                        onCancelCreateSourceFileDialog={this.onCancelCreateSourceFileDialog}
                        checkFileExists={filesStore.sourceFileNamesList.includes}
                        fileToDelete={filesStore.sourceFileToDelete}
                        onCancelDeletingSourceFile={filesStore.cancelDeletingSourceFile}
                        onConfirmDeleteFileDialog={this.onConfirmDeleteFileDialog}
                        sourceFileNamesList={filesStore.sourceFileNamesList}
                        selectedFile={filesStore.selectedSourceFile}
                        onFileSelected={this.onSourceFileSelected}
                        onImportFile={this.onImportSourceFile}
                        onCreateNewItem={this.onCreateNewSourceFile}
                        onDeleteItem={this.onDeleteSourceFile}
                        selectedSourceFileContent={filesStore.selectedSourceFileContent}
                    />
                </When>
                <When condition={this.props.filesStore!.activeTab == FilesTab.FONTS_TAB}>
                    <ConfirmDeleteFileDialog
                        darkTheme={this.props.appStore!.darkTheme}
                        onCancel={() => this.props.filesStore!.cancelDeletingFontFile()}
                        onAccept={() =>
                            this.props.filesStore!.completeDeletingFontFile(
                                this.props.workspaceStore!.workspacePaths!,
                            )
                        }
                        fileName={this.props.filesStore!.fontFileToDelete}
                    />
                    {!!this.props.filesStore!.selectedFontFile &&
                    this.props.filesStore!.fontInfoPanelOpened ? (
                        <FontHelpPanel
                            fileName={this.props.filesStore!.selectedFontFile!}
                            variableName={this.props.workspaceStore!.getResourceAliasName(
                                this.props.filesStore!.selectedFontFile!,
                            )}
                            isOpen={this.props.filesStore!.fontInfoPanelOpened}
                            onClose={() =>
                                (this.props.filesStore!.fontInfoPanelOpened = !this.props
                                    .filesStore!.fontInfoPanelOpened)
                            }
                        />
                    ) : null}
                    <FileBrowser
                        showContentArea={!!this.props.filesStore!.selectedFontFile}
                        fileList={this.props.filesStore!.fontFileNamesList}
                        selectedFile={this.props.filesStore!.selectedFontFile}
                        onSelectFile={(file) => {
                            this.props.filesStore!.setSelectedFontFile(
                                this.props.workspaceStore!.workspacePaths!,
                                file,
                            );
                        }}
                        onImportExistingItem={() => {
                            this.props.filesStore!.importFontFile(
                                this.props.workspaceStore!.workspacePaths!,
                            );
                        }}
                        onDelete={(fileName: string) => {
                            this.props.filesStore!.startDeletingFontFile(fileName);
                        }}
                    >
                        <Navbar>
                            <Navbar.Group align={Alignment.LEFT}>
                                <Text>{this.props.filesStore!.selectedFontFile}</Text>
                            </Navbar.Group>
                            <Navbar.Group align={Alignment.RIGHT}>
                                <Button
                                    small={true}
                                    icon={HELP}
                                    onClick={() =>
                                        (this.props.filesStore!.fontInfoPanelOpened = true)
                                    }
                                    minimal={true}
                                >
                                    How to use?
                                </Button>
                            </Navbar.Group>
                        </Navbar>
                        <FontViewer
                            fontFileBuffer={this.props.filesStore!.selectedFontFileContent!}
                            fontSize={this.props.filesStore!.fontViewerFontSize}
                            onFontSizeChanged={(value) =>
                                (this.props.filesStore!.fontViewerFontSize = value)
                            }
                        />
                    </FileBrowser>
                </When>
                <When condition={this.props.filesStore!.activeTab == FilesTab.IMAGES_TAB}>
                    <ConfirmDeleteFileDialog
                        darkTheme={this.props.appStore!.darkTheme}
                        onCancel={() => this.props.filesStore!.cancelDeletingImageFile()}
                        onAccept={() =>
                            this.props.filesStore!.completeDeletingImageFile(
                                this.props.workspaceStore!.workspacePaths!,
                            )
                        }
                        fileName={this.props.filesStore!.imageFileToDelete}
                    />
                    {!!this.props.filesStore!.selectedImageFile &&
                    this.props.filesStore!.imageInfoPanelOpened ? (
                        <ImageHelpPanel
                            fileName={this.props.filesStore!.selectedImageFile!}
                            variableName={this.props.workspaceStore!.getResourceAliasName(
                                this.props.filesStore!.selectedImageFile!,
                            )}
                            isOpen={this.props.filesStore!.imageInfoPanelOpened}
                            onClose={() =>
                                (this.props.filesStore!.imageInfoPanelOpened = !this.props
                                    .filesStore!.imageInfoPanelOpened)
                            }
                        />
                    ) : null}
                    <FileBrowser
                        showContentArea={!!this.props.filesStore!.selectedImageFile}
                        fileList={this.props.filesStore!.imageFileNamesList}
                        selectedFile={this.props.filesStore!.selectedImageFile}
                        onSelectFile={(file) => {
                            this.props.filesStore!.setSelectedImageFile(
                                this.props.workspaceStore!.workspacePaths!,
                                file,
                            );
                        }}
                        onImportExistingItem={() => {
                            this.props.filesStore!.importImage(
                                this.props.workspaceStore!.workspacePaths!,
                            );
                        }}
                        onDelete={(fileName: string) => {
                            this.props.filesStore!.startDeletingImageFile(fileName);
                        }}
                    >
                        <Navbar>
                            <Navbar.Group align={Alignment.LEFT}>
                                <Text>{this.props.filesStore!.selectedImageFile}</Text>
                            </Navbar.Group>
                            <Navbar.Group align={Alignment.RIGHT}>
                                <Button
                                    small={true}
                                    icon={HELP}
                                    onClick={() =>
                                        (this.props.filesStore!.imageInfoPanelOpened = true)
                                    }
                                    minimal={true}
                                >
                                    How to use?
                                </Button>
                            </Navbar.Group>
                        </Navbar>
                        <ImageViewer
                            fileName={this.props.filesStore!.selectedImageFile!}
                            imageFileBuffer={this.props.filesStore!.selectedImageFileContent!}
                        />
                    </FileBrowser>
                </When>
            </div>
        );
    }

    async componentDidMount(): Promise<void> {
        const paths = this.props.workspaceStore!.workspacePaths!;
        const filesStore = this.props.filesStore!;

        await Promise.all([
            filesStore.refreshSourceFilesList(paths),
            filesStore.refreshFontFilesList(paths),
            filesStore.refreshImageFilesList(paths),
        ]);

        await Promise.all([
            filesStore.watchSourcesDir(paths, () => {
                filesStore.refreshSourceFilesList(paths);
            }),
            filesStore.watchFontsDir(paths, () => {
                filesStore.refreshFontFilesList(paths);
            }),
            filesStore.watchImageDir(paths, () => {
                filesStore.refreshImageFilesList(paths);
            }),
        ]);
    }

    async componentWillUnmount() {
        const filesStore = this.props.filesStore!;
        await Promise.all([
            filesStore.unwatchSourcesDir(),
            filesStore.unwatchFontsDir(),
            filesStore.unwatchImageDir(),
        ]);
    }

    setActiveTab(tab: FilesTab) {
        this.props.filesStore!.activeTab = tab;
    }

    async onAcceptCreateSourceFileDialog(fileName: string) {
        this.props.filesStore!.createNewSourceFile(
            this.props.workspaceStore!.workspacePaths!,
            fileName,
        );
        this.props.filesStore!.createNewSourceFileDialogOpened = false;
    }

    onCancelCreateSourceFileDialog() {
        this.props.filesStore!.createNewSourceFileDialogOpened = false;
    }

    async onConfirmDeleteFileDialog() {
        const filesStore = this.props.filesStore!;
        const workspaceStore = this.props.workspaceStore!;
        return filesStore.completeDeletingSourceFile(workspaceStore.workspacePaths!);
    }

    onSourceFileSelected(fileName: string) {
        this.props.filesStore!.setSelectedSourceFile(
            this.props.workspaceStore!.workspacePaths!,
            fileName,
        );
    }

    onCreateNewSourceFile() {
        this.props.filesStore!.createNewSourceFileDialogOpened = true;
    }

    onImportSourceFile() {
        this.props.filesStore!.importSourceFile(this.props.workspaceStore!.workspacePaths!);
    }

    onDeleteSourceFile(fileName: string) {
        this.props.filesStore!.startDeletingSourceFile(fileName);
    }
}
