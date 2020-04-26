import * as React from 'react';
import {inject, observer} from "mobx-react";
import {H3} from "@blueprintjs/core";
import GeneralPanel from "@/renderer/app/containers/pages/properties/components/GeneralPanel";
import UserInterfacePanel from "@/renderer/app/containers/pages/properties/components/UserInterfacePanel";
import InputOutputPanel from "@/renderer/app/containers/pages/properties/components/InputOutputPanel";
import ManufacturerPanel from "@/renderer/app/containers/pages/properties/components/ManufacturerPanel";
import {matchesVersion, removeSpaces} from "@/renderer/app/util/string-utils";
import AudioUnitPanel from "@/renderer/app/containers/pages/properties/components/AudioUnitPanel";
import VstPanel from "@/renderer/app/containers/pages/properties/components/VstPanel";
import {UserConfig} from "@/renderer/app/model/user-config";
import {WorkspaceStore} from "@/renderer/app/stores/workspace-store";

const PropertiesPage = (props: { workspaceStore?: WorkspaceStore }) => {
    const {userConfig} = props.workspaceStore!;
    const setUserConfig = (config: UserConfig) => props.workspaceStore!.userConfig = config;

    return (
        <div className='PropertiesPage'>
            <H3>Properties</H3>
            <p>You can set all general project information here.</p>
            <div className='page-sections-container'>
                <section>
                    <GeneralPanel projectName={userConfig!.projectName}
                                  setProjectName={(value) => setUserConfig({...userConfig!, projectName: value})}
                                  prototype={userConfig!.prototype}
                                  setPrototype={(value) => setUserConfig({...userConfig!, prototype: value})}
                                  formats={userConfig!.formats}
                                  setFormats={(value) => setUserConfig({...userConfig!, formats: value})}
                                  version={userConfig!.pluginVersion}
                                  setVersion={(value) => matchesVersion(value) ? setUserConfig({
                                      ...userConfig!, pluginVersion: value
                                  }) : false}
                        /* TODO: matchesVersion makes the behaviour of this input field awkward, because it
                        jumps to the end of the field if you enter an invalid character. This needs to be fixed,
                        for example by providing a popover with a validation error but allowing to enter
                        arbitrary content. */
                    />
                </section>
                <section>
                    <ManufacturerPanel manufacturerName={userConfig!.manufacturerName}
                                       setManufacturerName={value => setUserConfig({
                                           ...userConfig!,
                                           manufacturerName: removeSpaces(value)
                                       })}
                                       manufacturerEmail={userConfig!.manufacturerEmail}
                                       setManufacturerEmail={value => setUserConfig({
                                           ...userConfig!,
                                           manufacturerEmail: removeSpaces(value)
                                       })}
                                       manufacturerCopyrightNotice={userConfig!.manufacturerCopyrightNotice}
                                       setManufacturerCopyrightNotice={value => setUserConfig({
                                           ...userConfig!,
                                           manufacturerCopyrightNotice: removeSpaces(value)
                                       })}
                                       manufacturerWebsite={userConfig!.manufacturerWebsite}
                                       setManufacturerWebsite={value => setUserConfig({
                                           ...userConfig!,
                                           manufacturerWebsite: removeSpaces(value)
                                       })}
                    />
                </section>
                <section>
                    <UserInterfacePanel uiWidth={userConfig!.uiWidth}
                                        setUiWidth={value => setUserConfig({...userConfig!, uiWidth: value})}
                                        uiHeight={userConfig!.uiHeight}
                                        setUiHeight={value => setUserConfig({...userConfig!, uiHeight: value})}
                                        fps={userConfig!.fps}
                                        setFps={value => setUserConfig({...userConfig!, fps: value})}
                                        uiEnabled={userConfig!.uiEnabled}
                                        setUiEnabled={value => setUserConfig({...userConfig!, uiEnabled: value})}
                                        uiResizable={userConfig!.uiResizable}
                                        setUiResizable={value => setUserConfig({...userConfig!, uiResizable: value})}
                    />
                </section>
                <section>
                    <InputOutputPanel inputChannels={userConfig!.inputChannels}
                                      setInputChannels={value => setUserConfig({...userConfig!, inputChannels: value})}
                                      outputChannels={userConfig!.outputChannels}
                                      setOutputChannels={value => setUserConfig({
                                          ...userConfig!,
                                          outputChannels: value
                                      })}
                                      pluginLatency={userConfig!.pluginLatency}
                                      setPluginLatency={value => setUserConfig({...userConfig!, pluginLatency: value})}
                                      midiIn={userConfig!.midiIn}
                                      setMidiIn={value => setUserConfig({...userConfig!, midiIn: value})}
                                      midiOut={userConfig!.midiOut}
                                      setMidiOut={value => setUserConfig({...userConfig!, midiOut: value})}
                                      mpe={userConfig!.mpe}
                                      setMpe={value => setUserConfig({...userConfig!, mpe: value})}
                                      stateChunks={userConfig!.stateChunks}
                                      setStateChunks={value => setUserConfig({...userConfig!, stateChunks: value})}
                    />
                </section>
                <section>
                    <AudioUnitPanel bundleName={userConfig!.audioUnitBundleName}
                                    setBundleName={value => setUserConfig({...userConfig!, audioUnitBundleName: value})}
                                    bundleManufacturer={userConfig!.audioUnitBundleManufacturer}
                                    setBundleManufacturer={value => setUserConfig({
                                        ...userConfig!,
                                        audioUnitBundleManufacturer: value
                                    })}
                                    bundleDomain={userConfig!.audioUnitBundleDomain}
                                    setBundleDomain={value => setUserConfig({
                                        ...userConfig!,
                                        audioUnitBundleDomain: value
                                    })}
                                    manufacturerId={userConfig!.audioUnitManufacturerId}
                                    setManufacturerId={value => setUserConfig({
                                        ...userConfig!,
                                        audioUnitManufacturerId: value
                                    })}
                                    audioUnitPluginType={userConfig!.audioUnitPluginType}
                                    setAudioUnitPluginType={value => setUserConfig({
                                        ...userConfig!,
                                        audioUnitPluginType: value
                                    })}
                    />
                </section>
                <section>
                    <VstPanel vst3Subcategory={userConfig!.vst3Subcategory}
                              setVst3Subcategory={value => setUserConfig({...userConfig!, vst3Subcategory: value})}
                              vst3UniqueId={userConfig!.vstUniqueId}
                              setVst3UniqueId={value => setUserConfig({...userConfig!, vstUniqueId: value})}
                    />
                </section>
            </div>
        </div>
    );
};

export default inject('workspaceStore')(observer(PropertiesPage))
