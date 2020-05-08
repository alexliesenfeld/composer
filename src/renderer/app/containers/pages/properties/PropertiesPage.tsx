import AudioUnitPanel from '@/renderer/app/containers/pages/properties/components/AudioUnitPanel';
import GeneralPanel from '@/renderer/app/containers/pages/properties/components/GeneralPanel';
import InputOutputPanel from '@/renderer/app/containers/pages/properties/components/InputOutputPanel';
import ManufacturerPanel from '@/renderer/app/containers/pages/properties/components/ManufacturerPanel';
import UserInterfacePanel from '@/renderer/app/containers/pages/properties/components/UserInterfacePanel';
import VstPanel from '@/renderer/app/containers/pages/properties/components/VstPanel';
import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { matchesVersion, removeSpaces } from '@/renderer/app/util/string-utils';
import { Tab, Tabs } from '@blueprintjs/core';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

const PropertiesPage = (props: { workspaceStore?: WorkspaceStore }) => {
    const { userConfig } = props.workspaceStore!;
    const setUserConfig = (config: WorkspaceConfig) => (props.workspaceStore!.userConfig = config);

    return (
        <div className="PropertiesPage">
            <Tabs
                animate={false}
                renderActiveTabPanelOnly={true}
                vertical={true}
                className="tab-pages"
            >
                <Tab
                    id="general"
                    title="General"
                    panel={
                        <div>
                            <GeneralPanel
                                projectName={userConfig!.projectName}
                                setProjectName={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        projectName: value,
                                    })
                                }
                                prototype={userConfig!.prototype}
                                setPrototype={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        prototype: value,
                                    })
                                }
                                version={userConfig!.pluginVersion}
                                setVersion={(value) =>
                                    matchesVersion(value)
                                        ? setUserConfig({
                                              ...userConfig!,
                                              pluginVersion: value,
                                          })
                                        : false
                                }
                            />
                            <ManufacturerPanel
                                manufacturerName={userConfig!.manufacturerName}
                                setManufacturerName={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        manufacturerName: removeSpaces(value),
                                    })
                                }
                                manufacturerEmail={userConfig!.manufacturerEmail}
                                setManufacturerEmail={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        manufacturerEmail: removeSpaces(value),
                                    })
                                }
                                manufacturerCopyrightNotice={
                                    userConfig!.manufacturerCopyrightNotice
                                }
                                setManufacturerCopyrightNotice={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        manufacturerCopyrightNotice: removeSpaces(value),
                                    })
                                }
                                manufacturerWebsite={userConfig!.manufacturerWebsite}
                                setManufacturerWebsite={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        manufacturerWebsite: removeSpaces(value),
                                    })
                                }
                            />
                        </div>
                    }
                />

                <Tab
                    id="interfaces"
                    title="Interfaces"
                    panel={
                        <div>
                            <UserInterfacePanel
                                uiWidth={userConfig!.uiWidth}
                                setUiWidth={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        uiWidth: value,
                                    })
                                }
                                uiHeight={userConfig!.uiHeight}
                                setUiHeight={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        uiHeight: value,
                                    })
                                }
                                fps={userConfig!.fps}
                                setFps={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        fps: value,
                                    })
                                }
                                uiEnabled={userConfig!.uiEnabled}
                                setUiEnabled={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        uiEnabled: value,
                                    })
                                }
                                uiResizable={userConfig!.uiResizable}
                                setUiResizable={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        uiResizable: value,
                                    })
                                }
                            />
                            <InputOutputPanel
                                inputChannels={userConfig!.inputChannels}
                                setInputChannels={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        inputChannels: value,
                                    })
                                }
                                outputChannels={userConfig!.outputChannels}
                                setOutputChannels={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        outputChannels: value,
                                    })
                                }
                                pluginLatency={userConfig!.pluginLatency}
                                setPluginLatency={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        pluginLatency: value,
                                    })
                                }
                                midiIn={userConfig!.midiIn}
                                setMidiIn={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        midiIn: value,
                                    })
                                }
                                midiOut={userConfig!.midiOut}
                                setMidiOut={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        midiOut: value,
                                    })
                                }
                                mpe={userConfig!.mpe}
                                setMpe={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        mpe: value,
                                    })
                                }
                                stateChunks={userConfig!.stateChunks}
                                setStateChunks={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        stateChunks: value,
                                    })
                                }
                            />
                        </div>
                    }
                    panelClassName="ember-panel"
                />

                <Tab
                    id="formats"
                    title="Formats"
                    panel={
                        <div>
                            <AudioUnitPanel
                                bundleName={userConfig!.audioUnitBundleName}
                                setBundleName={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        audioUnitBundleName: value,
                                    })
                                }
                                bundleManufacturer={userConfig!.audioUnitBundleManufacturer}
                                setBundleManufacturer={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        audioUnitBundleManufacturer: value,
                                    })
                                }
                                bundleDomain={userConfig!.audioUnitBundleDomain}
                                setBundleDomain={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        audioUnitBundleDomain: value,
                                    })
                                }
                                manufacturerId={userConfig!.audioUnitManufacturerId}
                                setManufacturerId={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        audioUnitManufacturerId: value,
                                    })
                                }
                                audioUnitPluginType={userConfig!.audioUnitPluginType}
                                setAudioUnitPluginType={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        audioUnitPluginType: value,
                                    })
                                }
                            />
                            <VstPanel
                                vst3Subcategory={userConfig!.vst3Subcategory}
                                setVst3Subcategory={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        vst3Subcategory: value,
                                    })
                                }
                                vst3UniqueId={userConfig!.vstUniqueId}
                                setVst3UniqueId={(value) =>
                                    setUserConfig({
                                        ...userConfig!,
                                        vstUniqueId: value,
                                    })
                                }
                            />
                        </div>
                    }
                />
            </Tabs>
        </div>
    );
};

export default inject('workspaceStore')(observer(PropertiesPage));
