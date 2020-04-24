import {
    AudioUnitPluginType,
    PluginFormat,
    Prototype,
    UserConfig,
    Vst3Subcategory
} from "@/renderer/app/model/user-config";
import * as path from "path";
import {DirectoryNotEmptyError} from "@/renderer/app/model/errors";
import {Fsx} from "@/renderer/app/util/fsx";

export const writeNewConfigToPath = async (filePath: string): Promise<unknown> => {
    const directoryPath = path.dirname(filePath);
    const filesInDirectory = await Fsx.readdir(directoryPath);

    if (filesInDirectory && filesInDirectory.length > 0) {
        throw new DirectoryNotEmptyError("The directory of a new project must be empty.", directoryPath)
    }

    return writeConfigToPath(filePath, createInitialConfig());
};

export const loadConfigFromPath = async (path: string): Promise<UserConfig> => {
    const fileContent = await Fsx.readFile(path, {encoding: 'utf-8'});
    return JSON.parse(fileContent);
};

export const writeConfigToPath = async (path: string, config: UserConfig): Promise<unknown> => {
    return Fsx.writeFile(path, JSON.stringify(config));
};

const createInitialConfig = (): UserConfig => {
    return {
        projectName: 'NewProject',
        prototype: Prototype.IPLIGEFFECT,
        uiEnabled: true,
        fps: 60,
        formats: [PluginFormat.AU2, PluginFormat.VST3],
        uiHeight: 600,
        uiWidth: 600,
        pluginVersion: '0.0.0',
        mpe: false,
        midiOut: false,
        midiIn: false,
        stateChunks: false,
        outputChannels: 2,
        inputChannels: 2,
        pluginLatency: 0,
        manufacturerWebsite: "www.my-plugin-company.com",
        manufacturerCopyrightNotice: "© www.my-plugin-company.com",
        manufacturerEmail: "mail@my-plugin-company.com",
        manufacturerName: "MyPlugInCompany",
        audioUnitBundleManufacturer: "MyPlugInCompany",
        audioUnitBundleDomain: "com",
        audioUnitManufacturerId: "MPIC",
        audioUnitBundleName: "NewProject",
        audioUnitPluginType: AudioUnitPluginType.EFFECT_OR_MUSIC_EFFECT,
        vst3Subcategory: Vst3Subcategory.FX,
        vstUniqueId: "nprj",
        uiResizable: false,
        iPlug2GitSha: "044fd947051f1ef267870a565890263ce2f8a53c"
    };
};
