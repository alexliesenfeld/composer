import * as React from 'react';

import {
    Alignment,
    Button,
    ButtonGroup,
    Card,
    Divider,
    Elevation,
    IProps,
    Menu,
    MenuItem,
    Navbar,
    Popover,
    Tab,
    Tabs
} from "@blueprintjs/core";
import {ADD, CARET_DOWN} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {inject, observer} from "mobx-react";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";
import {FilesStore, FilesTab} from "@/renderer/app/stores/files-store";
import {When} from "@/renderer/app/components/When";

@inject('workspaceStore', 'filesStore')
@observer
export class FilesPage extends React.PureComponent<{ workspaceStore?: WorkspaceStore, filesStore?: FilesStore }> {

    async refreshLists(): Promise<void> {
        const sourceFilesRefreshed = this.props.filesStore!.refreshSourceFilesList(this.props.workspaceStore!.configPath!);
        const fontFilesRefreshed = this.props.filesStore!.refreshFontFilesList(this.props.workspaceStore!.configPath!);
        const imageFilesRefreshed = this.props.filesStore!.refreshImageFilesList(this.props.workspaceStore!.configPath!);

        await sourceFilesRefreshed;
        await fontFilesRefreshed;
        await imageFilesRefreshed;
    }

    async componentDidMount(): Promise<void> {
        await this.refreshLists();
    }

    render() {
        const {sourceFileNamesList, fontFileNamesList, imageFileNamesList} = this.props.filesStore!;

        return (
            <div className='FilesPage'>
                <Navbar>
                    <Navbar.Group>
                        <Navbar.Heading>
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
                        </Navbar.Heading>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <ButtonGroup>
                            <Popover
                                content={<FileMenu filesStore={this.props.filesStore}
                                                   workspaceStore={this.props.workspaceStore}/>}
                                position={"bottom"}
                                minimal={true}>
                                <Button rightIcon={CARET_DOWN} icon={ADD} intent={"primary"} small={true}
                                        minimal={true}>Add</Button>
                            </Popover>
                            <Button icon="refresh"
                                    onClick={() => this.refreshLists()}
                                    small={true}
                                    minimal={true}>Refresh
                            </Button>
                        </ButtonGroup>
                    </Navbar.Group>
                </Navbar>
                <Card elevation={Elevation.TWO} className='file-list-container'>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.SOURCE_FILES_TAB}>
                        <FileList paths={sourceFileNamesList}/>
                    </When>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.FONTS_TAB}>
                        <FileList paths={fontFileNamesList}/>
                    </When>
                    <When condition={this.props.filesStore!.activeTab == FilesTab.IMAGES_TAB}>
                        <FileList paths={imageFileNamesList}/>
                    </When>
                </Card>
            </div>
        );
    }
}

const FileMenu = (props: { workspaceStore?: WorkspaceStore, filesStore?: FilesStore }) => {
    return (
        <Menu>
            <MenuItem text="Source File"
                      onClick={() => props.filesStore!.addNewSourceFile(props.workspaceStore!.configPath!)}/>
            <MenuItem text="Font"
                      onClick={() => props.filesStore!.addNewFontFile(props.workspaceStore!.configPath!)}/>
            <MenuItem text="Image"
                      onClick={() => props.filesStore!.addNewImage(props.workspaceStore!.configPath!)}/>
        </Menu>
    );
};

export const FileList = (props: IProps & { paths: string[] }) => {
    return (<div>
        {props.paths.map(function (item) {
            return <div key={item}><span>{item}</span><Divider/></div>;
        })}
    </div>);
};

