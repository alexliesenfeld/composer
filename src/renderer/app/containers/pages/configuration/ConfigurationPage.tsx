import AppPanel from '@/renderer/app/containers/pages/configuration/components/AppPanel';
import MacOsPanel from '@/renderer/app/containers/pages/configuration/components/MacOsPanel';
import GeneralPanel from '@/renderer/app/containers/pages/configuration/components/GeneralPanel';
import InputOutputPanel from '@/renderer/app/containers/pages/configuration/components/InputOutputPanel';
import ManufacturerPanel from '@/renderer/app/containers/pages/configuration/components/ManufacturerPanel';
import UserInterfacePanel from '@/renderer/app/containers/pages/configuration/components/UserInterfacePanel';
import VstPanel from '@/renderer/app/containers/pages/configuration/components/VstPanel';
import {
    IPlugPluginType,
    PluginFormat,
    Vst3Subcategory,
} from '@/renderer/app/model/workspace-config';
import { WorkspaceStore } from '@/renderer/app/stores/workspace-store';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

@inject('workspaceStore')
@observer
export class ConfigurationPage extends React.Component<{ workspaceStore?: WorkspaceStore }> {
    render() {
        const { workspaceConfig, validationErrors } = this.props.workspaceStore!;

        return (
            <div className="ConfigurationPage">
                <GeneralPanel
                    projectName={workspaceConfig!.projectName}
                    setProjectName={this.setProjectName}
                    mainClassName={workspaceConfig!.mainClassName}
                    setMainClassName={this.setMainClassName}
                    pluginType={workspaceConfig!.pluginType}
                    setPluginType={this.setPluginType}
                    version={workspaceConfig!.pluginVersion}
                    setVersion={this.setVersion}
                    vst3UniqueId={workspaceConfig!.vstUniqueId}
                    setVst3UniqueId={this.setVstUniqueId}
                    iPlugSha1={workspaceConfig!.iPlug2GitHash}
                    setIPlugSha1={this.setIPlugGitHash}
                    formats={workspaceConfig!.formats}
                    setFormats={this.setFormats}
                    validationErrors={validationErrors}
                />

                <ManufacturerPanel
                    manufacturerName={workspaceConfig!.manufacturerName}
                    setManufacturerName={this.setManufacturerName}
                    manufacturerId={workspaceConfig!.manufacturerId}
                    setManufacturerId={this.setManufacturerId}
                    manufacturerEmail={workspaceConfig!.manufacturerEmail}
                    setManufacturerEmail={this.setManufacturerEmail}
                    manufacturerCopyrightNotice={workspaceConfig!.manufacturerCopyrightNotice}
                    setManufacturerCopyrightNotice={this.setManufacturerCopyrightNotice}
                    manufacturerWebsite={workspaceConfig!.manufacturerWebsite}
                    setManufacturerWebsite={this.setManufacturerWebsite}
                    validationErrors={validationErrors}
                />

                <UserInterfacePanel
                    uiWidth={workspaceConfig!.uiWidth}
                    setUiWidth={this.setUiWidth}
                    uiHeight={workspaceConfig!.uiHeight}
                    setUiHeight={this.setUiHeight}
                    fps={workspaceConfig!.fps}
                    setFps={this.setFps}
                    uiEnabled={workspaceConfig!.uiEnabled}
                    setUiEnabled={this.setUiEnabled}
                    uiResizable={workspaceConfig!.uiResizable}
                    setUiResizable={this.setUiResizable}
                    validationErrors={validationErrors}
                />

                <InputOutputPanel
                    inputChannels={workspaceConfig!.inputChannels}
                    setInputChannels={this.setInputChannels}
                    outputChannels={workspaceConfig!.outputChannels}
                    setOutputChannels={this.setOutputChannels}
                    pluginLatency={workspaceConfig!.pluginLatency}
                    setPluginLatency={this.setPluginLatency}
                    midiIn={workspaceConfig!.midiIn}
                    setMidiIn={this.setMidiIn}
                    midiOut={workspaceConfig!.midiOut}
                    setMidiOut={this.setMidiOut}
                    mpe={workspaceConfig!.mpe}
                    setMpe={this.setMpe}
                    stateChunks={workspaceConfig!.stateChunks}
                    setStateChunks={this.setStateChunks}
                    validationErrors={validationErrors}
                />

                <MacOsPanel
                    bundleName={workspaceConfig!.macOsBundleName}
                    setBundleName={this.setBundleName}
                    bundleManufacturer={workspaceConfig!.macOsBundleManufacturer}
                    setBundleManufacturer={this.setBundleManufacturer}
                    bundleDomain={workspaceConfig!.macOsBundleDomain}
                    setBundleDomain={this.setBundleDomain}
                    validationErrors={validationErrors}
                />

                <VstPanel
                    vst3Subcategory={workspaceConfig!.vst3Subcategory}
                    setVst3Subcategory={this.setVst3Subcategory}
                    vst3SdkGitHash={workspaceConfig!.vst3SdkGitHash}
                    setVst3SdkGitHash={this.setVst3SdkGitHash}
                    validationErrors={validationErrors}
                />

                <AppPanel
                    waitMultiplier={workspaceConfig!.appVectorWaitMultiplier}
                    setWaitMultiplier={this.setWaitMultiplier}
                    outputMultiplier={workspaceConfig!.appOutputMultiplier}
                    setOutputMultiplier={this.setOutputMultiplier}
                    signalVectorSize={workspaceConfig!.appSignalVectorSize}
                    setSignalVectorSize={this.setSignalVectorSize}
                    validationErrors={validationErrors}
                />
            </div>
        );
    }

    setProjectName = (name: string) => {
        this.props.workspaceStore!.workspaceConfig!.projectName = name;
    };

    setMainClassName = (name: string) => {
        this.props.workspaceStore!.workspaceConfig!.mainClassName = name;
    };

    setPluginType = (pluginType: IPlugPluginType) => {
        this.props.workspaceStore!.workspaceConfig!.pluginType = pluginType;
    };

    setVersion = (version: string) => {
        this.props.workspaceStore!.workspaceConfig!.pluginVersion = version;
    };

    setVstUniqueId = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.vstUniqueId = value;
    };

    setIPlugGitHash = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.iPlug2GitHash = value;
    };

    setManufacturerName = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.manufacturerName = value;
    };

    setManufacturerId = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.manufacturerId = value;
    };

    setManufacturerEmail = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.manufacturerEmail = value;
    };

    setFormats = (value: PluginFormat[]) => {
        this.props.workspaceStore!.workspaceConfig!.formats = value;
    };

    setManufacturerCopyrightNotice = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.manufacturerCopyrightNotice = value;
    };

    setManufacturerWebsite = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.manufacturerWebsite = value;
    };

    setUiWidth = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.uiWidth = value;
    };

    setUiHeight = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.uiHeight = value;
    };

    setFps = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.fps = value;
    };

    setUiEnabled = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.uiEnabled = value;
    };

    setUiResizable = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.uiResizable = value;
    };

    setInputChannels = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.inputChannels = value;
    };

    setOutputChannels = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.outputChannels = value;
    };

    setPluginLatency = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.pluginLatency = value;
    };

    setMidiIn = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.midiIn = value;
    };

    setMidiOut = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.midiOut = value;
    };

    setMpe = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.mpe = value;
    };

    setStateChunks = (value: boolean) => {
        this.props.workspaceStore!.workspaceConfig!.stateChunks = value;
    };

    setBundleName = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.macOsBundleName = value;
    };

    setBundleManufacturer = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.macOsBundleManufacturer = value;
    };

    setBundleDomain = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.macOsBundleDomain = value;
    };

    setVst3Subcategory = (value: Vst3Subcategory) => {
        this.props.workspaceStore!.workspaceConfig!.vst3Subcategory = value;
    };

    setVst3SdkGitHash = (value: string) => {
        this.props.workspaceStore!.workspaceConfig!.vst3SdkGitHash = value;
    };

    setWaitMultiplier = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.appVectorWaitMultiplier = value;
    };

    setOutputMultiplier = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.appOutputMultiplier = value;
    };

    setSignalVectorSize = (value: number) => {
        this.props.workspaceStore!.workspaceConfig!.appSignalVectorSize = value;
    };
}
