import * as React from 'react';

import {FilesStore} from "@/renderer/app/stores/filesStore";
import {
    Alignment,
    Button,
    ButtonGroup,
    Card,
    Divider,
    Elevation,
    H3,
    Icon,
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
import {toasted} from "@/renderer/app/support/util/app-toaster";

const FilesPage = (props: {filesStore?: FilesStore }) => {
    const {sourceFilesList} = props.filesStore!;
    const [refreshSourceFilesList] = toasted([props.filesStore!.refreshSourceFilesList]);

    return (
        <div>
            <H3>Files</H3>
            <p>
                User interfaces that enable people to interact smoothly with data, ask better questions, and
                make better decisions.
            </p>
            <Navbar>
                <Navbar.Group>
                    <Navbar.Heading>
                        <Tabs animate={true} id="navbar" large={true}>
                            <Tab id="Home" title={<><Icon icon="code"/> Source Files</>}/>
                            <Tab id="Files" title={<><Icon icon="font"/> Fonts</>}/>
                            <Tab id="Builds" title={<><Icon icon="media"/> Images</>}/>
                        </Tabs>
                    </Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <ButtonGroup>
                        <Popover content={<FileMenu/>} position={"bottom"}>
                            <Button rightIcon={CARET_DOWN} icon={ADD} intent={"primary"}>Add</Button>
                        </Popover>
                        <Button icon="refresh" onClick={refreshSourceFilesList}>Refresh</Button>
                    </ButtonGroup>
                </Navbar.Group>
            </Navbar>

            <Card elevation={Elevation.TWO}>
                <SourceFileList paths={sourceFilesList}/>
            </Card>
        </div>
    );
};

export const FileMenu = (props: IProps) => (
    <Menu className={props.className}>
        <MenuItem text="Source File" icon="code" {...props} />
        <MenuItem text="Font" icon="font" {...props} />
        <MenuItem text="Image" icon="media" {...props} />
    </Menu>
);

export const SourceFileList = (props: IProps & { paths: string[] }) => {
    return (<div>
        {props.paths.map(function (item) {
            return <div><span>{item}</span><Divider/></div>;
        })}
    </div>);
};

export default inject('filesStore')(observer(FilesPage))
