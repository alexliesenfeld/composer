import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';

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

type ValidatorFunction = (config: WorkspaceConfig) => string | null | undefined;

export class WorkspaceConfigValidator {
    validators = new Map<WorkspaceConfigKey, ValidatorFunction>([
        ['projectName', this.createProjectNameValidator()],
    ]);

    validate(
        config: WorkspaceConfig,
        keys?: WorkspaceConfigKey[],
    ): WorkspaceConfigValidationErrors {
        const validators = !keys
            ? this.validators
            : keys // if keys were provided, reduce the validator map to only contain the selected validators
                  .filter((key) => this.validators.has(key))
                  .reduce((map, key) => map.set(key, this.validators.get(key)!), new Map());

        const errors = new WorkspaceConfigValidationErrors();

        for (const [key, validator] of validators) {
            const error = validator(config);
            if (!!error) {
                errors.add(key, error);
            }
        }

        return errors;
    }

    private createProjectNameValidator(): ValidatorFunction {
        return (config: WorkspaceConfig) => {
            if (!config.projectName || config.projectName.trim().length == 0) {
                return 'The project name must not be empty';
            }
            if (config.projectName.trim().length < 3) {
                return 'The project name must be at least three characters long';
            }
            if (!/^[a-z0-9]+$/i.test(config.projectName.trim())) {
                return 'The project name can only contain alphanumeric characters without spaces';
            }
        };
    }
}
