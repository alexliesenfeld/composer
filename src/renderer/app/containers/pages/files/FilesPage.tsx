import * as React from 'react';

import {Alignment, Button, Navbar, Tab, Tabs, Text} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore, FilesTab} from "@/renderer/app/stores/files-store";
import {When} from "@/renderer/app/components/When";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import {FontViewer} from "@/renderer/app/components/FontViewer";
import {ImageViewer} from "@/renderer/app/components/ImageViewer";
import {FileBrowser} from "@/renderer/app/components/FileBrowser";
import CreateFileDialog from "@/renderer/app/components/CreateNewFileDialog";
import {ConfirmDeleteFileDialog} from "@/renderer/app/components/ConfirmDeleteFileDialog";
import {AppStore} from "@/renderer/app/stores/app-store";
import {ImageHelpPanel} from "@/renderer/app/containers/pages/files/info-panels/ImageHelpPanel";
import {HELP} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {FontHelpPanel} from "@/renderer/app/containers/pages/files/info-panels/FontHelpPanel";

@inject('workspaceStore', 'filesStore', 'appStore')
@observer
export class FilesPage extends React.Component<{ workspaceStore?: WorkspaceStore, filesStore?: FilesStore, appStore?: AppStore }> {

    async componentDidMount(): Promise<void> {
        const paths = this.props.workspaceStore!.workspacePaths!;
        await Promise.all([
            this.props.filesStore!.refreshSourceFilesList(paths),
            this.props.filesStore!.refreshFontFilesList(paths),
            this.props.filesStore!.refreshImageFilesList(paths),
        ]);

        await Promise.all([
            this.props.filesStore!.watchSourcesDir(paths, () => {
                this.props.filesStore!.refreshSourceFilesList(paths);
            }),
            this.props.filesStore!.watchFontsDir(paths, () => {
                this.props.filesStore!.refreshFontFilesList(paths);
            }),
            this.props.filesStore!.watchImageDir(paths, () => {
                this.props.filesStore!.refreshImageFilesList(paths);
            })
        ]);
    }

    async componentWillUnmount() {
        await Promise.all([
            this.props.filesStore!.unwatchSourcesDir(),
            this.props.filesStore!.unwatchFontsDir(),
            this.props.filesStore!.unwatchImageDir()
        ]);
    }

    render() {
        return (
            <div className='FilesPage'>
                <Tabs
                    animate={false}
                    large={false}
                    selectedTabId={this.props.filesStore!.activeTab}
                    onChange={(tab: FilesTab) => {
                        this.props.filesStore!.activeTab = tab;
                    }}>
                    <Tab id={FilesTab.SOURCE_FILES_TAB} title='Source Files'/>
                    <Tab id={FilesTab.FONTS_TAB} title='Fonts'/>
                    <Tab id={FilesTab.IMAGES_TAB} title='Images'/>
                </Tabs>
                <When condition={this.props.filesStore!.activeTab == FilesTab.SOURCE_FILES_TAB}>
                    <CreateFileDialog isOpen={this.props.filesStore!.createNewSourceFileDialogOpened}
                                      title={"Create new source file"}
                                      onAccept={(fileName) => {
                                          this.props.filesStore!.createNewSourceFile(this.props.workspaceStore!.workspacePaths!, fileName);
                                          this.props.filesStore!.createNewSourceFileDialogOpened = false;
                                      }}
                                      onCancel={() => this.props.filesStore!.createNewSourceFileDialogOpened = false}
                                      fileExists={(value: string) => this.props.filesStore!.sourceFileNamesList.includes(value)}
                                      allowedFileExtensions={['.h', '.hpp', '.cpp']}
                    />
                    <ConfirmDeleteFileDialog
                        darkTheme={this.props.appStore!.darkTheme}
                        onCancel={() => this.props.filesStore!.cancelDeletingSourceFile()}
                        onAccept={() => this.props.filesStore!.completeDeletingSourceFile(this.props.workspaceStore!.workspacePaths!)}
                        fileName={this.props.filesStore!.sourceFileToDelete}
                    />
                    <FileBrowser
                        showContentArea={true}
                        fileList={this.props.filesStore!.sourceFileNamesList}
                        selectedFile={this.props.filesStore!.selectedSourceFile}
                        onSelectFile={(file) => {
                            this.props.filesStore!.setSelectedSourceFile(this.props.workspaceStore!.workspacePaths!, file);
                        }}
                        onImportExistingItem={() => {
                            this.props.filesStore!.importSourceFile(this.props.workspaceStore!.workspacePaths!);
                        }}
                        onCreateNewItem={() => {
                            this.props.filesStore!.createNewSourceFileDialogOpened = true;
                        }}
                        onDelete={(fileName: string) => {
                            this.props.filesStore!.startDeletingSourceFile(fileName);
                        }}
                    >
                        <AceEditor
                            style={{width: "100%", height: "100%"}}
                            placeholder='No content'
                            mode='c_cpp'
                            theme='tomorrow_night'
                            name='source-file-editor'
                            value={this.props.filesStore!.selectedSourceFile ? this.props.filesStore!.selectedSourceFileContent : undefined}
                            fontSize={16}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={false}
                            setOptions={{
                                useWorker: false,
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                tabSize: 4,
                                readOnly: true,
                            }}
                        />
                    </FileBrowser>
                </When>
                <When condition={this.props.filesStore!.activeTab == FilesTab.FONTS_TAB}>
                    <ConfirmDeleteFileDialog
                        darkTheme={this.props.appStore!.darkTheme}
                        onCancel={() => this.props.filesStore!.cancelDeletingFontFile()}
                        onAccept={() => this.props.filesStore!.completeDeletingFontFile(this.props.workspaceStore!.workspacePaths!)}
                        fileName={this.props.filesStore!.fontFileToDelete}
                    />
                    {!!this.props.filesStore!.selectedFontFile && this.props.filesStore!.fontInfoPanelOpened ?
                        <FontHelpPanel fileName={this.props.filesStore!.selectedFontFile!}
                                       variableName={this.props.workspaceStore!.getResourceAliasName(this.props.filesStore!.selectedFontFile!)}
                                       isOpen={this.props.filesStore!.fontInfoPanelOpened}
                                       onClose={() => this.props.filesStore!.fontInfoPanelOpened = !this.props.filesStore!.fontInfoPanelOpened}
                        /> : null
                    }
                    <FileBrowser
                        showContentArea={!!this.props.filesStore!.selectedFontFile}
                        fileList={this.props.filesStore!.fontFileNamesList}
                        selectedFile={this.props.filesStore!.selectedFontFile}
                        onSelectFile={(file) => {
                            this.props.filesStore!.setSelectedFontFile(this.props.workspaceStore!.workspacePaths!, file);
                        }}
                        onImportExistingItem={() => {
                            this.props.filesStore!.importFontFile(this.props.workspaceStore!.workspacePaths!);
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
                                <Button small={true}
                                        icon={HELP}
                                        onClick={() => this.props.filesStore!.fontInfoPanelOpened = true}
                                        minimal={true}>How to use?</Button>
                            </Navbar.Group>
                        </Navbar>
                        <FontViewer fontFileBuffer={this.props.filesStore!.selectedFontFileContent!}
                                    fontSize={this.props.filesStore!.fontViewerFontSize}
                                    onFontSizeChanged={(value) => this.props.filesStore!.fontViewerFontSize = value}/>
                    </FileBrowser>
                </When>
                <When condition={this.props.filesStore!.activeTab == FilesTab.IMAGES_TAB}>
                    <ConfirmDeleteFileDialog
                        darkTheme={this.props.appStore!.darkTheme}
                        onCancel={() => this.props.filesStore!.cancelDeletingImageFile()}
                        onAccept={() => this.props.filesStore!.completeDeletingImageFile(this.props.workspaceStore!.workspacePaths!)}
                        fileName={this.props.filesStore!.imageFileToDelete}
                    />
                    {!!this.props.filesStore!.selectedImageFile && this.props.filesStore!.imageInfoPanelOpened ?
                        <ImageHelpPanel fileName={this.props.filesStore!.selectedImageFile!}
                                        variableName={this.props.workspaceStore!.getResourceAliasName(this.props.filesStore!.selectedImageFile!)}
                                        isOpen={this.props.filesStore!.imageInfoPanelOpened}
                                        onClose={
                                            () => this.props.filesStore!.imageInfoPanelOpened = !this.props.filesStore!.imageInfoPanelOpened
                                        }/> : null
                    }
                    <FileBrowser
                        showContentArea={!!this.props.filesStore!.selectedImageFile}
                        fileList={this.props.filesStore!.imageFileNamesList}
                        selectedFile={this.props.filesStore!.selectedImageFile}
                        onSelectFile={(file) => {
                            this.props.filesStore!.setSelectedImageFile(this.props.workspaceStore!.workspacePaths!, file);
                        }}
                        onImportExistingItem={() => {
                            this.props.filesStore!.importImage(this.props.workspaceStore!.workspacePaths!);
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
                                <Button small={true}
                                        icon={HELP}
                                        onClick={() => this.props.filesStore!.imageInfoPanelOpened = true}
                                        minimal={true}>How to use?</Button>
                            </Navbar.Group>
                        </Navbar>
                        <ImageViewer fileName={this.props.filesStore!.selectedImageFile!}
                                     imageFileBuffer={this.props.filesStore!.selectedImageFileContent!}/>
                    </FileBrowser>
                </When>
            </div>
        );
    }
}
