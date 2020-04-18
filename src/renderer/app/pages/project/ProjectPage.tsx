import * as React from 'react';
import {inject, observer} from "mobx-react";
import {
    Card,
    Checkbox,
    Divider,
    Elevation,
    FormGroup,
    H3,
    H5,
    InputGroup,
    NumericInput,
    Popover,
    Position
} from "@blueprintjs/core";
import {ConfigStore} from "@/renderer/app/stores/configStore";
import {SelectInput} from "@/renderer/app/support/components/SelectInput";
import {GeneralPanel} from "@/renderer/app/pages/project/components/GeneralPanel";
import {UserInterfacePanel} from "@/renderer/app/pages/project/components/UserInterfacePanel";

const ProjectPage = (props: { configStore?: ConfigStore }) => {
    const {userConfig, setUserConfig} = props.configStore!;

    return (
        <div className='ProjectPage'>
            <H3>Project</H3>
            <p>You can set all general project information here.</p>

            <section>
                <GeneralPanel projectName={userConfig!.projectName}
                              setProjectName={(value) => setUserConfig({...userConfig!, projectName: value})}
                              prototype={userConfig!.prototype}
                              setPrototype={(value) => setUserConfig({...userConfig!, prototype: value})}
                              formats={userConfig!.formats}
                              setFormats={(value) => setUserConfig({...userConfig!, formats: value})}
                              version={userConfig!.version}
                              setVersion={(value) => setUserConfig({...userConfig!, version: value})}
                />
            </section>

            <section>
                <UserInterfacePanel
                    uiWidth={userConfig!.uiWidth}
                    setUiWidth={value => setUserConfig({...userConfig!, uiWidth: value})}
                    uiHeight={userConfig!.uiHeight}
                    setUiHeight={value => setUserConfig({...userConfig!, uiHeight: value})}
                    fps={userConfig!.fps}
                    setFps={value => setUserConfig({...userConfig!, fps: value})}
                    uiEnabled={userConfig!.uiEnabled}
                    setUiEnabled={value => setUserConfig({...userConfig!, uiEnabled: value})}
                />
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
                            ]} selectedItemKey={0} onClick={(item) => {

                            }}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="Output-Channels" labelFor="prototype-input">
                            <SelectInput items={[
                                {key: 2, text: '2'},
                                {key: 4, text: '4'}
                            ]} selectedItemKey={0} onClick={(item) => {

                            }}/>
                        </FormGroup>
                        <FormGroup className='middle-column' label="Plug-In Latency" labelFor="prototype-input">
                            <NumericInput placeholder="Enter a number..." fill={true}/>
                        </FormGroup>
                        <FormGroup className='right-column' label="MIDI" labelFor="text-input">
                            <Checkbox label="In" inline={true}/>
                            <Checkbox label="Out" inline={true}/>
                            <Popover enforceFocus={false} interactionKind={"hover"}
                                     popoverClassName="bp3-popover-content-sizing" position={Position.TOP}>
                                <Checkbox label="MPE" inline={true}/>
                                <div>
                                    <H5>MIDI Polyphonic Expression (MPE)</H5>
                                    <p>MPE is a method of using MIDI which enables multidimensional controllers to
                                        control multiple parameters of every note within MPE-compatible software.</p>
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
