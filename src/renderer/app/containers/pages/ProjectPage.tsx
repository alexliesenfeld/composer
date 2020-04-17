import * as React from 'react';
import {inject, observer} from "mobx-react";
import {ProjectStore} from "@/renderer/app/stores/projectStore";
import {
    Button,
    Card,
    Checkbox,
    Divider,
    Elevation,
    FormGroup,
    H3,
    H5,
    InputGroup,
    NumericInput,
    Popover, Position
} from "@blueprintjs/core";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {SelectInput} from "@/renderer/app/components/SelectInput";
import {Prototype} from "@/lib/model/user-config";

const ProjectPage = (props: { projectStore?: ProjectStore, configStore?: ConfigStore }) => {
    const {userConfig} = props.configStore!;

    return (
        <div className='ProjectPage'>
            <H3>Project</H3>
            <p>You can set all general project information here.</p>

            {/* General */}
            <section>
                <Card elevation={Elevation.TWO}>
                    <H5>General</H5>
                    <Divider/>
                    <div className='row'>
                        <FormGroup className='left-column' label="Plug-In name" labelFor="text-input">
                            <InputGroup id="text-input" placeholder="Please enter the name of the plug-in"/>
                        </FormGroup>
                        <FormGroup className='right-column' label="Prototype" labelFor="prototype-input">
                            <SelectInput items={[
                                {key: Prototype.IPLIGEFFECT, text: 'IPlugEffect'},
                                {key: Prototype.IPLUGINSTRUMENT, text: 'IPlugInstrument'}
                            ]} selectedItemKey={userConfig!.prototype} onClick={(item) => {
                                userConfig!.prototype = item.key!
                            }}/>
                        </FormGroup>

                    </div>
                    <div className='row'>
                        <FormGroup className='left-column' label="Version" labelFor="text-input">
                            <InputGroup id="text-input" placeholder="Please enter the version of the plug-in"/>
                        </FormGroup>
                        <FormGroup className='right-column' label="Formats" labelFor="text-input">
                            <Checkbox label="VST2" inline={true}/>
                            <Checkbox label="VST3" inline={true}/>
                            <Checkbox label="AU2" inline={true}/>
                            <Checkbox label="AAX" inline={true}/>
                            <Checkbox label="iOS" inline={true}/>
                        </FormGroup>

                    </div>
                </Card>
            </section>

            {/* User Interface */}
            <section>
                <Card elevation={Elevation.TWO}>
                    <div style={{ display: 'flow-root'}}>
                        <H5>User Interface</H5>
                    </div>
                    <Divider/>
                    <div className='row'>
                        <FormGroup className='left-column' label="Width" labelFor="prototype-input">
                            <NumericInput placeholder="Enter a number..." fill={true}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="Height" labelFor="prototype-input">
                            <NumericInput placeholder="Enter a number..." fill={true}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="FPS" labelFor="prototype-input">
                            <NumericInput placeholder="Enter a number..." fill={true}/>
                        </FormGroup>
                        <FormGroup className='right-column' label="Graphical User Interface" labelFor="prototype-input">
                            <Checkbox label="Enabled" inline={true} />
                        </FormGroup>

                    </div>
                </Card>
            </section>

            {/* Input/Output */}
            <section>
                <Card elevation={Elevation.TWO}>
                    <H5>Input/Output</H5>
                    <Divider/>
                    <div className='row'>
                        <FormGroup className='left-column' label="Input-Channels" labelFor="prototype-input">
                            <SelectInput items={[
                                {key: 2, text: '2'},
                                {key: 4, text: '4'}
                            ]} selectedItemKey={userConfig!.prototype} onClick={(item) => {
                                userConfig!.prototype = item.key!
                            }}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="Output-Channels" labelFor="prototype-input">
                            <SelectInput items={[
                                {key: 2, text: '2'},
                                {key: 4, text: '4'}
                            ]} selectedItemKey={userConfig!.prototype} onClick={(item) => {
                                userConfig!.prototype = item.key!
                            }}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="Plug-In Latency" labelFor="prototype-input">
                            <NumericInput placeholder="Enter a number..." fill={true}/>
                        </FormGroup>
                        <FormGroup className='right-column' label="MIDI" labelFor="text-input">
                            <Checkbox label="In" inline={true}/>
                            <Checkbox label="Out" inline={true}/>
                            <Popover enforceFocus={false} interactionKind={"hover"}  popoverClassName="bp3-popover-content-sizing" position={Position.TOP}>
                                <Checkbox label="MPE" inline={true}/>
                                <div>
                                    <H5>MIDI Polyphonic Expression (MPE)</H5>
                                    <p>MPE is a method of using MIDI which enables multidimensional controllers to control multiple parameters of every note within MPE-compatible software.</p>
                                    <span>Source: https://www.midi.org/articles-old/midi-polyphonic-expression-mpe</span>
                                </div>
                            </Popover>
                        </FormGroup>
                    </div>
                </Card>
            </section>

            {/* Manufacturer */}
            <section>
                <Card elevation={Elevation.TWO}>
                    <H5>Manufacturer</H5>
                    <Divider/>
                    <div className='row'>
                        <FormGroup className='left-column' label="Name" labelFor="text-input">
                            <InputGroup id="text-input" placeholder="Please enter the manufacturer name"/>
                        </FormGroup>
                        <FormGroup className='right-column' label="E-Mail" labelFor="text-input">
                            <InputGroup id="text-input" placeholder="Please enter the manufacturer E-Mail address"/>
                        </FormGroup>
                    </div>
                    <div className='row'>
                        <FormGroup className='left-column' label="Copyright" labelFor="text-input">
                            <InputGroup id="text-input" placeholder="Please enter the copyright string"/>
                        </FormGroup>
                        <FormGroup className='right-column' label="Website" labelFor="text-input">
                            <InputGroup id="text-input"
                                        placeholder="Please enter the web address of the plug-in or manufacturer website"/>
                        </FormGroup>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default inject('projectStore', 'configStore')(observer(ProjectPage))
