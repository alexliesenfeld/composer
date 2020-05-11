import { DirectoryNotEmptyError } from '@/renderer/app/model/errors';
import {
    IPlugPluginType,
    PluginFormat,
    Prototype,
    Vst3Subcategory,
    WorkspaceConfig,
} from '@/renderer/app/model/workspace-config';
import { Fsx } from '@/renderer/app/util/fsx';
import * as fs from 'fs';
import * as path from 'path';

const parseConfig = (content: string): WorkspaceConfig => {
    return JSON.parse(content);
};

export const writeConfigToPath = async (
    path: string,
    config: WorkspaceConfig,
): Promise<unknown> => {
    return Fsx.writeFile(path, JSON.stringify(config, null, 4));
};

export const writeFile = async (path: string, content: string): Promise<void> => {
    return Fsx.writeFile(path, content);
};

export const readFile = async (path: string): Promise<string> => {
    return (await Fsx.readFile(path)).toString();
};

const createInitialConfig = (): WorkspaceConfig => {
    return {
        projectName: 'NewProject',
        uiEnabled: true,
        fps: 60,
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
        manufacturerWebsite: 'www.my-plugin-company.com',
        manufacturerCopyrightNotice: '© www.my-plugin-company.com',
        manufacturerEmail: 'mail@my-plugin-company.com',
        manufacturerName: 'MyPlugInCompany',
        manufacturerId: 'MPUC',
        audioUnitBundleManufacturer: 'MyPlugInCompany',
        audioUnitBundleDomain: 'com',
        audioUnitBundleName: 'NewProject',
        pluginType: IPlugPluginType.EFFECT,
        vst3Subcategory: Vst3Subcategory.OTHER,
        vstUniqueId: 'nprj',
        uiResizable: true,
        iPlug2GitSha: '33700e4a498c8e9440b7281008d32d4b2a24a12f',
        vst3SdkGitSha: '0908f475f52af56682321192d800ef25d1823dd2',
        appOutputMultiplier: 1,
        appSignalVectorSize: 64,
        appVectorWaitMultiplier: 0,
    };
};

export const writeNewConfigToPath = async (filePath: string): Promise<unknown> => {
    const directoryPath = path.dirname(filePath);
    const filesInDirectory = await Fsx.readdir(directoryPath);

    if (filesInDirectory && filesInDirectory.length > 0) {
        throw new DirectoryNotEmptyError(
            'The directory of a new project must be empty.',
            directoryPath,
        );
    }

    return writeConfigToPath(filePath, createInitialConfig());
};

export const loadConfigFromPath = async (path: string): Promise<WorkspaceConfig> => {
    const fileContent = await Fsx.readFile(path, { encoding: 'utf-8' });

    return parseConfig(fileContent);
};

export const loadConfigFromPathSync = (path: string): WorkspaceConfig => {
    const fileContent = fs.readFileSync(path, { encoding: 'utf-8' });

    return parseConfig(fileContent);
};
