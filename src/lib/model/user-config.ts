import webpack from "webpack";

export enum Prototype {
    IPLIGEFFECT = "IPlugEffect",
    IPLUGINSTRUMENT = "IPlugInstrument"
}

export enum PluginFormat {
    VST2 = "VST2",
    VST3 = "VST3",
    AU2 = "AU2",
    AAX = "AAX",
    IOS = "iOS",
}

export interface UserConfig {
    projectName: string;
    prototype: Prototype;
    formats: PluginFormat[];
    pluginVersion: string;
    uiWidth: number
    uiHeight: number
    fps: number
    uiEnabled: boolean
}
