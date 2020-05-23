import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { parseVersionNumber } from '@/renderer/app/util/string-utils';
import { isDefined } from '@/renderer/app/util/type-utils';
export type WorkspaceConfigKey = keyof WorkspaceConfig;

type ValidatorFunction = (config: WorkspaceConfig) => string | null | undefined;

export class WorkspaceConfigValidator {
    validators = new Map<WorkspaceConfigKey, ValidatorFunction>([
        [
            'projectName',
            (config: WorkspaceConfig) => {
                if (!config.projectName || config.projectName.trim().length == 0) {
                    return 'The project name must not be empty.';
                }
                if (config.projectName.trim().length < 3) {
                    return 'The project name must be at least three characters long.';
                }
                if (!/^[a-z0-9]+$/i.test(config.projectName.trim())) {
                    return 'The project name can only contain alphanumeric characters without spaces.';
                }
            },
        ],
        [
            'pluginType',
            (config: WorkspaceConfig) => {
                if (!config.pluginType) {
                    return 'Please select a plugin type.';
                }
            },
        ],
        [
            'formats',
            (config: WorkspaceConfig) => {
                if (!config.formats || config.formats.length === 0) {
                    return 'Please select at least one plugin format.';
                }
            },
        ],
        [
            'pluginVersion',
            (config: WorkspaceConfig) => {
                if (!config.pluginVersion) {
                    return 'You need to provide a plugin version.';
                }
                try {
                    const result = parseVersionNumber(config.pluginVersion);
                    if (result.major > 65535 || result.minor > 255 || result.patch > 255) {
                        return 'Version number too long. Maximum version values are "65535.255.255".';
                    }
                } catch (err) {
                    return 'The version number must be of the form "major.minor.patch", each part being a number without leading zeros.';
                }
            },
        ],
        [
            'vstUniqueId',
            (config: WorkspaceConfig) => {
                if (!config.vstUniqueId || config.vstUniqueId.trim().length === 0) {
                    return 'You need to provide a unique plugin id.';
                }
                if (!/^[a-z]{4}$/i.test(config.vstUniqueId)) {
                    return 'The unique plugin ID must contain 4 characters.';
                }
            },
        ],
        [
            'mainClassName',
            (config: WorkspaceConfig) => {
                if (!config.mainClassName || config.mainClassName.trim().length === 0) {
                    return 'You need to provide a main class name.';
                }
                if (config.mainClassName.trim().length < 3) {
                    return 'The main class name must be at least three characters long.';
                }
                if (!/^[a-z0-9]+$/i.test(config.mainClassName)) {
                    return 'The main class name can only contain alphanumeric characters without spaces.';
                }
            },
        ],
        [
            'iPlug2GitHash',
            (config: WorkspaceConfig) => {
                if (!config.iPlug2GitHash || config.iPlug2GitHash.trim().length === 0) {
                    return 'You need to provide a Git Hash from the iPlug repository on Github.';
                }
                if (!/^[a-z0-9]{40}$/i.test(config.iPlug2GitHash)) {
                    return 'The iPlug Git Hash must consist of 40 alphanumeric characters.';
                }
            },
        ],
        [
            'manufacturerName',
            (config: WorkspaceConfig) => {
                if (!config.manufacturerName || config.manufacturerName.trim().length === 0) {
                    return 'You need to provide a manufacturer name.';
                }

                if (config.manufacturerName.trim().length <= 3) {
                    return 'The manufacturer name must be at least 3 characters long.';
                }

                if (!/^[a-z0-9]+$/i.test(config.manufacturerName)) {
                    return 'The manufacturer name must consist of alphanumeric characters only.';
                }
            },
        ],
        [
            'manufacturerId',
            (config: WorkspaceConfig) => {
                if (!config.manufacturerId || config.manufacturerId.trim().length === 0) {
                    return 'You need to provide a manufacturer unique ID.';
                }

                if (!/^[a-z]{4}$/i.test(config.manufacturerId)) {
                    return 'The manufacturer id must consist of 4 characters.';
                }
            },
        ],
        [
            'uiWidth',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.uiWidth) || config.uiWidth < 1) {
                    return 'You need to provide a GUI width that is greater than zero.';
                }
            },
        ],
        [
            'uiHeight',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.uiHeight) || config.uiHeight < 1) {
                    return 'You need to provide a GUI height that is greater than zero.';
                }
            },
        ],
        [
            'fps',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.fps) || config.fps < 1) {
                    return 'You need to provide a FPS value that is greater than zero.';
                }
            },
        ],
        [
            'inputChannels',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.inputChannels) || config.inputChannels < 1) {
                    return 'The number of input channels must be greater than zero.';
                }
            },
        ],
        [
            'outputChannels',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.outputChannels) || config.outputChannels < 1) {
                    return 'The number of output channels must be greater than zero.';
                }
            },
        ],
        [
            'pluginLatency',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.pluginLatency) || config.pluginLatency < 0) {
                    return 'The plugin latency value must be equal or grater than zero.';
                }
            },
        ],
        [
            'audioUnitBundleName',
            (config: WorkspaceConfig) => {
                if (!config.audioUnitBundleName || config.audioUnitBundleName.trim().length === 0) {
                    return 'You need to provide a bundle name.';
                }

                if (!/^[a-z0-9]+$/i.test(config.audioUnitBundleName)) {
                    return 'The bundle name must consist of alphanumeric characters only.';
                }
            },
        ],
        [
            'audioUnitBundleManufacturer',
            (config: WorkspaceConfig) => {
                if (
                    !config.audioUnitBundleManufacturer ||
                    config.audioUnitBundleManufacturer.trim().length === 0
                ) {
                    return 'You need to provide a bundle manufacturer name.';
                }

                if (!/^[a-z0-9]+$/i.test(config.audioUnitBundleManufacturer)) {
                    return 'The bundle manufacturer name must consist of alphanumeric characters only.';
                }
            },
        ],
        [
            'audioUnitBundleDomain',
            (config: WorkspaceConfig) => {
                if (
                    !config.audioUnitBundleDomain ||
                    config.audioUnitBundleDomain.trim().length === 0
                ) {
                    return 'You need to provide a bundle domain.';
                }

                if (!/^[a-z0-9]+$/i.test(config.audioUnitBundleDomain)) {
                    return 'The bundle domain must consist of alphanumeric characters only.';
                }
            },
        ],
        [
            'vst3Subcategory',
            (config: WorkspaceConfig) => {
                if (!config.vst3Subcategory) {
                    return 'Please select a VST3 subcategory.';
                }
            },
        ],
        [
            'vst3SdkGitHash',
            (config: WorkspaceConfig) => {
                if (!config.vst3SdkGitHash || config.vst3SdkGitHash.trim().length === 0) {
                    return 'You need to provide a Git Hash for the VST3 SDK repository on Github.';
                }
                if (!/^[a-z0-9]{40}$/i.test(config.vst3SdkGitHash)) {
                    return 'The VST3 SDK Git Hash must consist of 40 alphanumeric characters.';
                }
            },
        ],
        [
            'appVectorWaitMultiplier',
            (config: WorkspaceConfig) => {
                if (
                    !isDefined(config.appVectorWaitMultiplier) ||
                    config.appVectorWaitMultiplier < 0
                ) {
                    return 'The app vector wait multiplier must be equal or grater than zero.';
                }
            },
        ],
        [
            'appOutputMultiplier',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.appOutputMultiplier) || config.appOutputMultiplier < 0) {
                    return 'The app output multiplier must be equal or grater than zero.';
                }
            },
        ],
        [
            'appSignalVectorSize',
            (config: WorkspaceConfig) => {
                if (!isDefined(config.appSignalVectorSize) || config.appSignalVectorSize < 1) {
                    return 'The app signal vector size must be grater than zero.';
                }
            },
        ],
    ]);

    validate(
        config: WorkspaceConfig,
        keys?: WorkspaceConfigKey[],
    ): ValidationErrors<WorkspaceConfigKey> {
        const validators = !keys
            ? this.validators
            : keys // if keys were provided, reduce the validator map to only contain the selected validators
                  .filter((key) => this.validators.has(key))
                  .reduce((map, key) => map.set(key, this.validators.get(key)!), new Map());

        const errors = new ValidationErrors<WorkspaceConfigKey>();

        for (const [key, validator] of validators) {
            const error = validator(config);
            if (!!error) {
                errors.add(key, error);
            }
        }

        return errors;
    }
}
