import AppPanel from '@/renderer/app/containers/pages/configuration/components/AppPanel';
import AudioUnitPanel from '@/renderer/app/containers/pages/configuration/components/AudioUnitPanel';
import GeneralPanel from '@/renderer/app/containers/pages/configuration/components/GeneralPanel';
import InputOutputPanel from '@/renderer/app/containers/pages/configuration/components/InputOutputPanel';
import ManufacturerPanel from '@/renderer/app/containers/pages/configuration/components/ManufacturerPanel';
import UserInterfacePanel from '@/renderer/app/containers/pages/configuration/components/UserInterfacePanel';
import VstPanel from '@/renderer/app/containers/pages/configuration/components/VstPanel';
import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { matchesVersion, removeSpaces } from '@/renderer/app/util/string-utils';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

const ConfigurationPage = (props: { workspaceStore?: WorkspaceStore }) => {
    const { userConfig } = props.workspaceStore!;
    const setUserConfig = (config: WorkspaceConfig) => (props.workspaceStore!.userConfig = config);

    return (
        <div className="ConfigurationPage">
            <GeneralPanel
                projectName={userConfig!.projectName}
                setProjectName={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        projectName: value,
                    })
                }
                pluginType={userConfig!.pluginType}
                setPluginType={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        pluginType: value,
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
                vst3UniqueId={userConfig!.vstUniqueId}
                setVst3UniqueId={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        vstUniqueId: value,
                    })
                }
                iPlugSha1={userConfig!.iPlug2GitSha}
                setIPlugSha1={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        iPlug2GitSha: value,
                    })
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
                manufacturerId={userConfig!.manufacturerId}
                setManufacturerId={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        manufacturerId: removeSpaces(value),
                    })
                }
                manufacturerEmail={userConfig!.manufacturerEmail}
                setManufacturerEmail={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        manufacturerEmail: removeSpaces(value),
                    })
                }
                manufacturerCopyrightNotice={userConfig!.manufacturerCopyrightNotice}
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
            />
            <VstPanel
                vst3Subcategory={userConfig!.vst3Subcategory}
                setVst3Subcategory={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        vst3Subcategory: value,
                    })
                }
                vst3SdkGitSha={userConfig!.vst3SdkGitSha}
                setVst3SdkGitSha={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        vst3SdkGitSha: value,
                    })
                }
            />
            <AppPanel
                waitMultiplier={userConfig!.appVectorWaitMultiplier}
                setWaitMultiplier={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        appVectorWaitMultiplier: value,
                    })
                }
                outputMultiplier={userConfig!.appOutputMultiplier}
                setOutputMultiplier={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        appOutputMultiplier: value,
                    })
                }
                signalVectorSize={userConfig!.appSignalVectorSize}
                setSignalVectorSize={(value) =>
                    setUserConfig({
                        ...userConfig!,
                        appSignalVectorSize: value,
                    })
                }
            />
        </div>
    );
};

export default inject('workspaceStore')(observer(ConfigurationPage));
