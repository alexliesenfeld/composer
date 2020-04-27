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
import {FilesStore} from "@/renderer/app/stores/files-store";

const FilesPage = (props: { workspaceStore?: WorkspaceStore, filesStore?: FilesStore }) => {
    const {sourceFilesList} = props.filesStore!;

    return (
        <div>
            <Navbar>
                <Navbar.Group>
                    <Navbar.Heading>
                        <Tabs animate={false} id="navbar" large={false}>
                            <Tab id="Home" title='Source Files'/>
                            <Tab id="Files" title='Fonts'/>
                            <Tab id="Builds" title='Images'/>
                        </Tabs>
                    </Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <ButtonGroup>
                        <Popover
                            content={<FileMenu filesStore={props.filesStore} workspaceStore={props.workspaceStore}/>}
                            position={"bottom"}
                            minimal={true}>
                            <Button rightIcon={CARET_DOWN} icon={ADD} intent={"primary"} small={true}
                                    minimal={true}>Add</Button>
                        </Popover>
                        <Button icon="refresh"
                                onClick={() => props.filesStore!.refreshSourceFilesList(
                                    props.workspaceStore!.configPath!
                                )}
                                small={true}
                                minimal={true}>Refresh</Button>
                    </ButtonGroup>
                </Navbar.Group>
            </Navbar>
            <Card elevation={Elevation.TWO}>
                <SourceFileList paths={sourceFilesList}/>
            </Card>
        </div>
    );
};

const FileMenu = (props: { workspaceStore?: WorkspaceStore, filesStore?: FilesStore }) => {
    return (
        <Menu>
            <MenuItem text="Source File"
                      onClick={() => props.filesStore!.addNewSourceFile(props.workspaceStore!.configPath!)}/>
            <MenuItem text="Font"/>
            <MenuItem text="Image"/>
        </Menu>
    );
};

export const SourceFileList = (props: IProps & { paths: string[] }) => {
    return (<div>
        {props.paths.map(function (item) {
            return <div><span>{item}</span><Divider/></div>;
        })}
    </div>);
};

export default inject('workspaceStore', 'filesStore')(observer(FilesPage))
