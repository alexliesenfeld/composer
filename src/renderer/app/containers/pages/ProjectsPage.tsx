import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ProjectStore} from "@/renderer/app/stores/projectStore";
import {
    Button, ButtonGroup,
    Card,
    ControlGroup,
    Divider,
    Elevation,
    FormGroup,
    H3, H5,
    InputGroup,
    IProps,
    Popover
} from "@blueprintjs/core";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {ADD, CARET_DOWN} from "@blueprintjs/icons/lib/esm/generated/iconNames";
import {FileMenu} from "@/renderer/app/containers/pages/FilesPage";


const ProjectsPage = (props: { projectStore?: ProjectStore, configStore?: ConfigStore }) => {
    return (
        <div>
            <H3>Project</H3>
            <p>
                You can set all general project information here.
            </p>

            <Card elevation={Elevation.TWO}>
                <H5>General</H5>
                <div className='row'>
                    <FormGroup className='left-column'
                               helperText="This is the name of the project and of the plug-in itself. It will appear as the name of binary files, installers, documents, etc. "
                               label="Project title"
                               labelFor="text-input"
                               labelInfo="(required)">
                        <InputGroup id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <FormGroup className='right-column'
                               helperText="Select the prototype of your plug-in. This is one of iPlug2 example projects that will be used to build the base of your plugin."
                               label="Prototype"
                               labelFor="prototype-input"
                               labelInfo="(required)">
                        <Popover content={<FileMenu/>} position={"bottom"} fill={true}>
                            <Button id="prototype-input" rightIcon={CARET_DOWN} icon={ADD} intent={"primary"} fill={true}>Add</Button>
                        </Popover>
                    </FormGroup>
                </div>

            </Card>
        </div>
    );
};

export default inject('projectStore', 'configStore')(observer(ProjectsPage))
