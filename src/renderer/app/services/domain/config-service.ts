import { ValidationErrors } from '@/renderer/app/model/validation';
import {
    IPlugPluginType,
    PluginFormat,
    Vst3Subcategory,
    WorkspaceConfig,
} from '@/renderer/app/model/workspace-config';
import {
    WorkspaceConfigKey,
    WorkspaceConfigValidator,
} from '@/renderer/app/services/domain/config-validator';
import { Fsx } from '@/renderer/app/util/fsx';

export class ConfigService {
    readonly validator = new WorkspaceConfigValidator();

    validate(
        config: WorkspaceConfig,
        keys?: WorkspaceConfigKey[],
    ): ValidationErrors<WorkspaceConfigKey> {
        return this.validator.validate(config, keys);
    }

    createDefaultConfig(): WorkspaceConfig {
        return {
            projectName: 'NewProject',
            mainClassName: 'NewProject',
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
            macOsBundleManufacturer: 'MyPlugInCompany',
            macOsBundleDomain: 'com',
            macOsBundleName: 'NewProject',
            pluginType: IPlugPluginType.EFFECT,
            vst3Subcategory: Vst3Subcategory.OTHER,
            vstUniqueId: 'nprj',
            uiResizable: true,
            iPlug2GitHash: '92937579278ef078a0b9835038fbdfe3d5e772c7',
            vst3SdkGitHash: '0908f475f52af56682321192d800ef25d1823dd2',
            appOutputMultiplier: 1,
            appSignalVectorSize: 64,
            appVectorWaitMultiplier: 0,
        };
    }

    writeWorkspaceConfigToPath = async (
        path: string,
        config: WorkspaceConfig,
    ): Promise<unknown> => {
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
