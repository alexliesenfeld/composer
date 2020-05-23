import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import { parseVersionNumber } from '@/renderer/app/util/string-utils';
export type WorkspaceConfigKey = keyof WorkspaceConfig;

type ValidatorFunction = (config: WorkspaceConfig) => string | null | undefined;

export class WorkspaceConfigValidator {
    validators = new Map<WorkspaceConfigKey, ValidatorFunction>([
        [
            'projectName',
            (config: WorkspaceConfig) => {
                if (!config.projectName || config.projectName.trim().length == 0) {
                    return 'The project name must not be empty';
                }
                if (config.projectName.trim().length < 3) {
                    return 'The project name must be at least three characters long';
                }
                if (!/^[a-z0-9]+$/i.test(config.projectName.trim())) {
                    return 'The project name can only contain alphanumeric characters without spaces';
                }
            },
        ],
        [
            'pluginType',
            (config: WorkspaceConfig) => {
                if (!config.pluginType) {
                    return 'Please select a plugin type';
                }
            },
        ],
        [
            'formats',
            (config: WorkspaceConfig) => {
                if (!config.formats || config.formats.length === 0) {
                    return 'Please select at least one plugin format';
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
                    return 'The main class name must be at least three characters long';
                }
                if (!/^[a-z0-9]+$/i.test(config.mainClassName)) {
                    return 'The main class name can only contain alphanumeric characters without spaces';
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
