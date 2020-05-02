import * as React from 'react';

import {
    Alignment,
    Button,
    ButtonGroup,
    Card,
    IconName,
    ITreeNode,
    Navbar,
    Text,
    Slider,
    Tab,
    Tabs,
    Tree, H5, H6
} from "@blueprintjs/core";
import {CLEAN, FONT, HEADER, IMPORT, MEDIA, NEW_OBJECT, TRASH} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {inject, observer} from "mobx-react";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore, FilesTab} from "@/renderer/app/stores/files-store";
import {When} from "@/renderer/app/components/When";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import * as path from "path";
import {FontViewer} from "@/renderer/app/components/FontViewer";
import {ELEVATION_2} from "@blueprintjs/core/lib/esm/common/classes";
import {ImageViewer} from "@/renderer/app/components/ImageViewer";

@inject('workspaceStore', 'filesStore')
@observer
export class FilesPage extends React.Component<{ workspaceStore?: WorkspaceStore, filesStore?: FilesStore }> {

    async componentDidMount(): Promise<void> {
        await Promise.all([
            this.props.filesStore!.refreshSourceFilesList(this.props.workspaceStore!.configPath!),
            this.props.filesStore!.refreshFontFilesList(this.props.workspaceStore!.configPath!),
            this.props.filesStore!.refreshImageFilesList(this.props.workspaceStore!.configPath!),
        ]);

        await Promise.all([
            this.props.filesStore!.watchSourcesDir(this.props.workspaceStore!.configPath!, () => {
                this.props.filesStore!.refreshSourceFilesList(this.props.workspaceStore!.configPath!);
            }),
            this.props.filesStore!.watchFontsDir(this.props.workspaceStore!.configPath!, () => {
                this.props.filesStore!.refreshFontFilesList(this.props.workspaceStore!.configPath!);
            }),
            this.props.filesStore!.watchImageDir(this.props.workspaceStore!.configPath!, () => {
                this.props.filesStore!.refreshImageFilesList(this.props.workspaceStore!.configPath!);
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
        const {sourceFileNamesList, fontFileNamesList, imageFileNamesList} = this.props.filesStore!;

        return (
            <div className='FilesPage'>
                <Tabs animate={false}
                      large={false}
                      selectedTabId={this.props.filesStore!.activeTab}
                      onChange={(tab: FilesTab) => {
                          this.props.filesStore!.activeTab = tab;
                      }}>
                    <Tab id={FilesTab.SOURCE_FILES_TAB} title='Source Files'/>
                    <Tab id={FilesTab.FONTS_TAB} title='Fonts'/>
                    <Tab id={FilesTab.IMAGES_TAB} title='Images'/>
                </Tabs>
                <div className='file-list-tab-page row'>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.SOURCE_FILES_TAB}>
                        <div className='left-column file-list-container'>
                            <FileList paths={sourceFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedSourceFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.setSelectedSourceFile(this.props.workspaceStore!.configPath!, file);
                                      }}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewSourceFile(this.props.workspaceStore!.configPath!);
                                      }}
                                      onCreateNewItem={() => { /*TODO*/
                                      }}
                            />
                        </div>
                        <div className='right-column viewer-container'>
                            <Card className={`${ELEVATION_2} full-width no-padding`}>
                                <AceEditor
                                    style={{width: "100%", height: "100%"}}
                                    placeholder='No file has been loaded'
                                    mode='c_cpp'
                                    theme='tomorrow_night'
                                    name='source-file-editor'
                                    value={this.props.filesStore!.selectedSourceFileContent}
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
                            </Card>
                        </div>
                    </When>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.FONTS_TAB}>
                        <div className='left-column file-list-container'>
                            <FileList paths={fontFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedFontFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.setSelectedFontFile(this.props.workspaceStore!.configPath!, file);
                                      }}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewFontFile(this.props.workspaceStore!.configPath!);
                                      }}
                                      onCreateNewItem={() => { /*TODO*/
                                      }}
                            />
                        </div>
                        <div className='right-column viewer-container'>
                            <When condition={!!this.props.filesStore!.selectedFontFileContent}>
                                <Card className={`${ELEVATION_2} full-width no-padding`}>
                                    <Navbar>
                                        <Navbar.Group align={Alignment.LEFT}>
                                            <Text>{this.props.filesStore!.selectedFontFile}</Text>
                                        </Navbar.Group>
                                        <Navbar.Group align={Alignment.RIGHT} className='font-size-slider-nav'>
                                            <Slider
                                                min={0}
                                                max={100}
                                                stepSize={1}
                                                labelStepSize={10}
                                                onChange={(value) => this.props.filesStore!.fontViewerFontSize = value}
                                                value={this.props.filesStore!.fontViewerFontSize}
                                            />
                                        </Navbar.Group>
                                    </Navbar>

                                    <FontViewer fontFileBuffer={this.props.filesStore!.selectedFontFileContent!}
                                                fontSize={this.props.filesStore!.fontViewerFontSize}/>
                                </Card>

                            </When>
                        </div>
                    </When>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.IMAGES_TAB}>
                        <div className='left-column file-list-container'>
                            <FileList paths={imageFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedImageFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.setSelectedImageFile(this.props.workspaceStore!.configPath!, file);
                                      }}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewImage(this.props.workspaceStore!.configPath!);
                                      }}/>
                        </div>
                        <div className='right-column viewer-container'>
                            <When
                                condition={!!this.props.filesStore!.selectedImageFile && !!this.props.filesStore!.selectedImageFileContent}>
                                <Card className={`${ELEVATION_2} full-width no-padding`}>
                                    <Navbar>
                                        <Navbar.Group align={Alignment.LEFT}>
                                            <Text>{this.props.filesStore!.selectedImageFile}</Text>
                                        </Navbar.Group>
                                        <Navbar.Group align={Alignment.RIGHT}>
                                            <ButtonGroup>
                                                <Button small={true}
                                                        onClick={() => this.props.filesStore!.imageViewerStretchImage = false}
                                                        active={!this.props.filesStore!.imageViewerStretchImage}
                                                >Original</Button>
                                                <Button small={true}
                                                        onClick={() => this.props.filesStore!.imageViewerStretchImage = true}
                                                        active={this.props.filesStore!.imageViewerStretchImage}
                                                >Stretch</Button>
                                            </ButtonGroup>
                                        </Navbar.Group>

                                    </Navbar>

                                    <ImageViewer fileName={this.props.filesStore!.selectedImageFile!}
                                                 imageFileBuffer={this.props.filesStore!.selectedImageFileContent!}
                                                 fullSize={this.props.filesStore!.imageViewerStretchImage}/>
                                </Card>
                            </When>

                        </div>
                    </When>
                </div>
            </div>
        );
    }
}

interface FileListProps {
    paths: string[],
    onSelectFile: (file: string) => void,
    currentlySelectedFile: string | undefined,
    onCreateNewItem?: () => void;
    onImportExistingItem: () => void;
}

export const FileList = (props: FileListProps) => {
    return (<Card className={`${ELEVATION_2} full-width no-padding`}>
        <Navbar>
            <Navbar.Group align={"left"}>
                <ButtonGroup>
                    {
                        props.onCreateNewItem ?
                            <Button icon={NEW_OBJECT} small={true} minimal={true}
                                    onClick={() => props.onCreateNewItem!()}>New</Button> : null
                    }
                    <Button icon={IMPORT} small={true} minimal={true}
                            onClick={() => props.onImportExistingItem()}>Import</Button>
                </ButtonGroup>

            </Navbar.Group>

        </Navbar>
        <Tree className='file-tree'
              contents={props.paths.map((fileName) => {
                  return {
                      id: fileName,
                      hasCaret: false,
                      icon: getIconForFileName(fileName),
                      label: fileName,
                      isSelected: fileName === props.currentlySelectedFile,
                      secondaryLabel: <Button small={true} minimal={true} icon={TRASH}/>
                  } as ITreeNode;
              })}

              onNodeClick={((node) => {
                  props.onSelectFile(node.id as string);
              })}
        />
    </Card>);
};

const getIconForFileName = (fileName: string): IconName | undefined => {
    switch (path.extname(fileName)) {
        case ".h":
            return HEADER;
        case ".cpp":
            return CLEAN;
        case ".ttf":
            return FONT;
        case ".png":
        case ".bmp":
        case ".svg":
        case ".jpeg":
        case ".jpg":
            return MEDIA;
        default:
            return undefined;
    }
};
