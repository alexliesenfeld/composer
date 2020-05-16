import { DirectoryNotEmptyError } from '@/renderer/app/model/errors';
import {
    IPlugPluginType,
    PluginFormat,
    Vst3Subcategory,
    WorkspaceConfig,
} from '@/renderer/app/model/workspace-config';
import { Fsx } from '@/renderer/app/util/fsx';

export type WorkspaceConfigKey = keyof WorkspaceConfig;

export class WorkspaceConfigValidationErrors {
    errors = new Map<WorkspaceConfigKey, string[]>();

    add(key: WorkspaceConfigKey, error: string) {
        if (!this.errors.has(key)) {
            this.errors.set(key, []);
        }
        this.errors.get(key)!.push(error);
    }

    hasErrors() {
        return this.errors.size > 0;
    }
}

export class ConfigService {
    createInitialConfig(): WorkspaceConfig {
        return {
            projectName: 'NewProject',
            uiEnabled: true,
            fps: 60,
            uiHeight: 600,
            uiWidth: 600,
            pluginVersion: '0.0.0',
            formats: [PluginFormat.AU2, PluginFormat.VST3, PluginFormat.APP],
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
            iPlug2GitHash: '33700e4a498c8e9440b7281008d32d4b2a24a12f',
            vst3SdkGitHash: '0908f475f52af56682321192d800ef25d1823dd2',
            appOutputMultiplier: 1,
            appSignalVectorSize: 64,
            appVectorWaitMultiplier: 0,
        };
    }

    async validate(config: WorkspaceConfig): Promise<WorkspaceConfigValidationErrors> {
        const errors = new WorkspaceConfigValidationErrors();

        if (!config.projectName || config.projectName.trim().length == 0) {
            errors.add('projectName', 'The project name must not be empty.');
        } else if (config.projectName.trim().length < 3) {
            errors.add('projectName', 'The project name must be at least three characters long.');
        } else if (!/^[a-z0-9]+$/i.test(config.projectName.trim())) {
            errors.add(
                'projectName',
                'The project name can only contain alphanumeric characters without spaces.',
            );
        }

        return errors;
    }

    writeConfigToPath = async (path: string, config: WorkspaceConfig): Promise<unknown> => {
        return Fsx.writeFile(path, JSON.stringify(config, null, 4));
    };

    async loadConfigFromPath(path: string): Promise<WorkspaceConfig> {
        const fileContent = await Fsx.readFile(path, { encoding: 'utf-8' });
        return this.parseConfig(fileContent);
    }

    private parseConfig(content: string): WorkspaceConfig {
        return JSON.parse(content);
    }
}
