import { When } from '@/renderer/app/components/When';
import { FontFileTabPage } from '@/renderer/app/containers/pages/files/components/FontFileTabPage';
import { ImageFileTabPage } from '@/renderer/app/containers/pages/files/components/ImageFileTabPage';
import { SourceFileTabPage } from '@/renderer/app/containers/pages/files/components/SourceFileTabPage';
import { AppStore } from '@/renderer/app/stores/app-store';
import { FilesStore, FilesTab } from '@/renderer/app/stores/files-store';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { Tab, Tabs } from '@blueprintjs/core';
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
    render() {
        const filesStore = this.props.filesStore!;
        const appStore = this.props.appStore!;

        return (
            <div className="FilesPage page">
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
                    <FontFileTabPage
                        darkTheme={appStore.darkTheme}
                        fileToDelete={filesStore.fontFileToDelete}
                        onCancelDeletingFile={filesStore.cancelDeletingFontFile}
                        onCompleteDeletingFile={this.onCompleteDeletingFontFile}
                        files={filesStore.fontFileNamesList}
                        selectedFile={filesStore.selectedFontFile}
                        onFileSelected={this.onFontFileSelected}
                        selectedFileContent={filesStore.selectedFontFileContent}
                        getVariableForFile={this.getVariableForFile}
                        onImportFile={this.onImportFontFile}
                        onDeleteFile={this.onDeleteFontFile}
                        infoPanelOpened={filesStore.fontInfoPanelOpened}
                        onInfoPanelClose={this.onFontInfoPanelClose}
                        onInfoPanelOpen={this.onFontInfoPanelOpen}
                        fontSize={filesStore.fontViewerFontSize}
                        onFontSizeChanged={this.onFontSizeChange}
                    />
                </When>
                <When condition={this.props.filesStore!.activeTab == FilesTab.IMAGES_TAB}>
                    <ImageFileTabPage
                        darkTheme={appStore.darkTheme}
                        fileToDelete={filesStore.imageFileToDelete}
                        onCancelDeletingFile={filesStore.cancelDeletingImageFile}
                        onCompleteDeletingFile={this.onCompleteDeletingImageFile}
                        files={filesStore.imageFileNamesList}
                        selectedFile={filesStore.selectedImageFile}
                        onFileSelected={this.onImageFileSelected}
                        selectedFileContent={filesStore.selectedImageFileContent}
                        getVariableForFile={this.getVariableForFile}
                        onImportFile={this.onImportImageFile}
                        onDeleteFile={this.onDeleteImageFile}
                        infoPanelOpened={filesStore.imageInfoPanelOpened}
                        onInfoPanelClose={this.onImageInfoPanelClose}
                        onInfoPanelOpen={this.onImageInfoPanelOpen}
                    />
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

    setActiveTab = (tab: FilesTab) => {
        this.props.filesStore!.activeTab = tab;
    };

    onAcceptCreateSourceFileDialog = async (fileName: string) => {
        await this.props.filesStore!.createNewSourceFile(
            this.props.workspaceStore!.workspacePaths!,
            fileName,
        );
        this.props.filesStore!.createNewSourceFileDialogOpened = false;
    };

    onCancelCreateSourceFileDialog = () => {
        this.props.filesStore!.createNewSourceFileDialogOpened = false;
    };

    onConfirmDeleteFileDialog = async () => {
        const filesStore = this.props.filesStore!;
        const workspaceStore = this.props.workspaceStore!;
        return filesStore.completeDeletingSourceFile(workspaceStore.workspacePaths!);
    };

    onSourceFileSelected = async (fileName: string) => {
        return this.props.filesStore!.setSelectedSourceFile(
            this.props.workspaceStore!.workspacePaths!,
            fileName,
        );
    };

    onCreateNewSourceFile = () => {
        this.props.filesStore!.createNewSourceFileDialogOpened = true;
    };

    onImportSourceFile = () => {
        return this.props.filesStore!.importSourceFile(this.props.workspaceStore!.workspacePaths!);
    };

    onDeleteSourceFile = (fileName: string) => {
        return this.props.filesStore!.startDeletingSourceFile(fileName);
    };

    onCompleteDeletingFontFile = async () => {
        return this.props.filesStore!.completeDeletingFontFile(
            this.props.workspaceStore!.workspacePaths!,
        );
    };

    onFontFileSelected = async (file: string) => {
        return this.props.filesStore!.setSelectedFontFile(
            this.props.workspaceStore!.workspacePaths!,
            file,
        );
    };

    onImportFontFile = async () => {
        return this.props.filesStore!.importFontFile(this.props.workspaceStore!.workspacePaths!);
    };

    onDeleteFontFile = async (fileName: string) => {
        return this.props.filesStore!.startDeletingFontFile(fileName);
    };

    onFontInfoPanelClose = () => {
        this.props.filesStore!.fontInfoPanelOpened = !this.props.filesStore!.fontInfoPanelOpened;
    };

    onFontInfoPanelOpen = () => {
        this.props.filesStore!.fontInfoPanelOpened = true;
    };

    onFontSizeChange = (value: number) => {
        this.props.filesStore!.fontViewerFontSize = value;
    };

    getVariableForFile = (fileName: string) => {
        return this.props.workspaceStore!.getResourceAliasName(fileName);
    };

    onCompleteDeletingImageFile = async () => {
        return this.props.filesStore!.completeDeletingImageFile(
            this.props.workspaceStore!.workspacePaths!,
        );
    };

    onImageFileSelected = async (file: string) => {
        return this.props.filesStore!.setSelectedImageFile(
            this.props.workspaceStore!.workspacePaths!,
            file,
        );
    };

    onImportImageFile = async () => {
        return this.props.filesStore!.importImage(this.props.workspaceStore!.workspacePaths!);
    };

    onDeleteImageFile = async (fileName: string) => {
        return this.props.filesStore!.startDeletingImageFile(fileName);
    };

    onImageInfoPanelClose = () => {
        this.props.filesStore!.imageInfoPanelOpened = !this.props.filesStore!.imageInfoPanelOpened;
    };

    onImageInfoPanelOpen = () => {
        this.props.filesStore!.imageInfoPanelOpened = true;
    };
}
