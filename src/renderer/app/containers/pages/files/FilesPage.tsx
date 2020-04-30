import * as React from 'react';

import {
    Alignment,
    Button,
    ButtonGroup,
    Card,
    IconName,
    ITreeNode,
    Menu,
    MenuItem,
    Navbar,
    Popover,
    Slider,
    Tab,
    Tabs,
    Tree
} from "@blueprintjs/core";
import {ADD, CARET_DOWN, CLEAN, FONT, HEADER, MEDIA, TRASH} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {inject, observer} from "mobx-react";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore, FilesTab} from "@/renderer/app/stores/files-store";
import {When} from "@/renderer/app/components/When";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import * as path from "path";
import {FontViewer} from "@/renderer/app/components/FontViewer";
import {ELEVATION_2} from "@blueprintjs/core/lib/esm/common/classes";

@inject('workspaceStore', 'filesStore')
@observer
export class FilesPage extends React.PureComponent<{ workspaceStore?: WorkspaceStore, filesStore?: FilesStore }> {

    async refreshLists(): Promise<void> {
        const actions = [
            this.props.filesStore!.refreshSourceFilesList(this.props.workspaceStore!.configPath!),
            this.props.filesStore!.refreshFontFilesList(this.props.workspaceStore!.configPath!),
            this.props.filesStore!.refreshImageFilesList(this.props.workspaceStore!.configPath!),
        ];

        await Promise.all(actions);

        if (this.props.filesStore!.selectedSourceFile) {
            this.props.filesStore!.loadSourceFileContent(this.props.workspaceStore!.configPath!, this.props.filesStore!.selectedSourceFile)
        }
    }

    async componentDidMount(): Promise<void> {
        await this.refreshLists();
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
                <div className='file-list-container row'>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.SOURCE_FILES_TAB}>
                        <div className='left-column' style={{maxWidth: "30em", paddingLeft: '1px'}}>
                            <FileList paths={sourceFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedSourceFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.selectedSourceFile = file;
                                          this.props.filesStore!.loadSourceFileContent(this.props.workspaceStore!.configPath!, file)
                                      }}
                                      onRefresh={() => this.refreshLists()}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewSourceFile(this.props.workspaceStore!.configPath!);
                                      }}
                                      onCreateNewItem={() => { /*TODO*/
                                      }}
                            />
                        </div>
                        <div className='right-column'>
                            <Card className={`${ELEVATION_2} full-width no-padding`}><AceEditor
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
                            /></Card>
                        </div>
                    </When>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.FONTS_TAB}>
                        <div className='left-column' style={{maxWidth: "30em", paddingLeft: '1px'}}>
                            <FileList paths={fontFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedFontFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.selectedFontFile = file;
                                          this.props.filesStore!.loadFontContent(this.props.workspaceStore!.configPath!, file)
                                      }}
                                      onRefresh={() => this.refreshLists()}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewFontFile(this.props.workspaceStore!.configPath!);
                                      }}
                                      onCreateNewItem={() => { /*TODO*/
                                      }}
                            />
                        </div>
                        <div className='right-column'>
                            <When condition={!!this.props.filesStore!.selectedFontFileContent}>
                                <Card className={`full-width no-padding`}>
                                    <Navbar>
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
                        <div className='left-column' style={{maxWidth: "30em", paddingLeft: '1px'}}>
                            <FileList paths={imageFileNamesList}
                                      currentlySelectedFile={this.props.filesStore!.selectedImageFile}
                                      onSelectFile={(file) => {
                                          this.props.filesStore!.selectedImageFile = file;
                                      }}
                                      onRefresh={() => this.refreshLists()}
                                      onImportExistingItem={() => {
                                          this.props.filesStore!.addNewImage(this.props.workspaceStore!.configPath!);
                                      }}/>
                        </div>
                        <div className='right-column'>

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
    onRefresh: () => void;
}

export const FileList = (props: FileListProps) => {
    return (<Card className={`${ELEVATION_2} full-width no-padding`}>
        <Navbar>
            <Navbar.Group align={"left"}>
                <Popover
                    content={
                        <Menu>
                            {
                                props.onCreateNewItem ?
                                    <MenuItem text="New" onClick={() => props.onCreateNewItem!()}/> : null
                            }
                            <MenuItem text="Import" onClick={() => props.onImportExistingItem()}/>
                        </Menu>
                    }
                    position={"bottom"}
                    minimal={true}>
                    <Button rightIcon={CARET_DOWN} icon={ADD} small={true} minimal={true}>Add</Button>
                </Popover>
            </Navbar.Group>
            <Navbar.Group align={"right"}>
                <Button icon="refresh" small={true} minimal={true}>Refresh</Button>
            </Navbar.Group>

        </Navbar>
        <Tree className='margin-top-1'
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
            return MEDIA;
        default:
            return undefined;
    }
};
