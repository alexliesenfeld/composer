import {AudioUnitPluginType, PluginFormat, Prototype, UserConfig, Vst3Subcategory} from "@/renderer/app/model/user-config";
import * as path from "path";
import {Fs} from "@/renderer/app/util/fs";
import {DirectoryNotEmptyError} from "@/renderer/app/model/errors";
import {activity} from "@/renderer/app/util/activity-util";

export class ConfigService {

    @activity("Creating a new workspace")
    async writeNewConfigToPath(filePath: string): Promise<unknown> {
        const directoryPath = path.dirname(filePath);
        const filesInDirectory = await Fs.readdir(directoryPath);

        if (filesInDirectory && filesInDirectory.length > 0) {
            throw new DirectoryNotEmptyError("The directory of a new project must be empty.", directoryPath)
        }

        return this.writeConfigToPath(filePath, ConfigService.createInitialConfig());
    }

    @activity("Loading workspace")
    async loadConfigFromPath(path: string): Promise<UserConfig>{
        const fileContent = await Fs.readFile(path, {encoding: 'utf-8'});
        return JSON.parse(fileContent);
    }

    @activity("Writing workspace data to the file system")
    async writeConfigToPath(path: string, config: UserConfig): Promise<unknown>{
        return Fs.writeFile(path, JSON.stringify(config));
    }

    private static createInitialConfig(): UserConfig {
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
    }

}
