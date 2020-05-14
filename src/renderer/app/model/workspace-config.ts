export enum Prototype {
    IPLIGEFFECT = 'IPlugEffect',
    IPLUGINSTRUMENT = 'IPlugInstrument',
}

export enum PluginFormat {
    VST2 = 'VST2',
    VST3 = 'VST3',
    AU2 = 'AU2',
    AAX = 'AAX',
    IOS = 'iOS',
    APP = 'App',
    WEB = 'Web',
}

export enum IPlugPluginType {
    EFFECT = 'Effect',
    INSTRUMENT = 'Instrument',
    MIDI_EFFECT = 'MIDI Effect',
}

export enum Vst3Subcategory {
    FX_ANALYZER = 'Fx|Analyzer',
    FX_DELAY = 'Fx|Delay',
    FX_DISTORTION = 'Fx|Distortion',
    FX_DYNAMICS = 'Fx|Dynamics',
    FX_EQ = 'Fx|EQ',
    FX_FILTER = 'Fx|Filter',
    FX = 'Fx',
    FX_INSTRUMENT = 'Fx|Instrument',
    FX_INSTRUMENT_EXTERNAL = 'Fx|Instrument|External',
    FX_SPATIAL = 'Fx|Spatial',
    FX_GENERATOR = 'Fx|Generator',
    FX_MASTERING = 'Fx|Mastering',
    FX_MODULATION = 'Fx|Modulation',
    FX_PITCH_SHIFT = 'Fx|Pitch Shift',
    FX_RESTORATION = 'Fx|Restoration',
    FX_REVERB = 'Fx|Reverb',
    FX_SURROUND = 'Fx|Surround',
    FX_TOOLS = 'Fx|Tools',
    FX_NETWORK = 'Fx|Network',
    INSTRUMENT = 'Instrument',
    INSTRUMENT_DRUM = 'Instrument|Drum',
    INSTRUMENT_EXTERNAL = 'Instrument|External',
    INSTRUMENT_PIANO = 'Instrument|Piano',
    INSTRUMENT_SAMPLER = 'Instrument|Sampler',
    INSTRUMENT_SYNTH = 'Instrument|Synth',
    INSTRUMENT_SYNTH_SAMLPER = 'Instrument|Synth|Sampler',
    SPATIAL = 'Spatial',
    SPATIAL_FX = 'Spatial|Fx',
    ONLY_RT = 'OnlyRT',
    ONLY_OFFLINE_PROCESS = 'OnlyOfflineProcess',
    NO_OFFLINE_PROCESS = 'NoOfflineProcess',
    UP_DOWNMIX = 'Up-Downmix',
    ANALYZER = 'Analyzer',
    AMBISONICS = 'Ambisonics',
    MONO = 'Mono',
    STEREO = 'Stereo',
    SURROUND = 'Surround',
    OTHER = 'Other',
}

export interface WorkspaceConfig {
    projectName: string;
    pluginType: IPlugPluginType;
    pluginVersion: string;
    formats: PluginFormat[];
    uiWidth: number;
    uiHeight: number;
    fps: number;
    uiResizable: boolean;
    uiEnabled: boolean;
    inputChannels: number;
    outputChannels: number;
    pluginLatency: number;
    midiIn: boolean;
    midiOut: boolean;
    mpe: boolean;
    stateChunks: boolean;
    manufacturerName: string;
    manufacturerId: string;
    manufacturerEmail: string;
    manufacturerWebsite: string;
    manufacturerCopyrightNotice: string;
    audioUnitBundleName: string;
    audioUnitBundleManufacturer: string;
    audioUnitBundleDomain: string;
    vst3Subcategory: Vst3Subcategory;
    vstUniqueId: string;
    iPlug2GitSha: string;
    vst3SdkGitSha: string;
    appVectorWaitMultiplier: number;
    appOutputMultiplier: number;
    appSignalVectorSize: number;
}
