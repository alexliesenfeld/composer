import { ValidationErrors } from '@/renderer/app/model/validation';
import { WorkspaceConfigKey } from '@/renderer/app/services/domain/config-validator';
import { FormGroup } from '@blueprintjs/core';
import * as React from 'react';

export interface WorkspaceAttributeFormGroupProps {
    label: string;
    inline: boolean;
    helperText?: string;
    disabled?: boolean;
    validationErrors: ValidationErrors<WorkspaceConfigKey>;
    validationKey: WorkspaceConfigKey;
}

export class WorkspaceAttributeFormGroup extends React.Component<WorkspaceAttributeFormGroupProps> {
    render() {
        const validationError = this.props.validationErrors.errors.get(this.props.validationKey);
        const helperText = validationError ? validationError : this.props.helperText;
        return (
            <FormGroup
                className={`WorkspaceAttributeFormGroup ${
                    validationError ? 'validation-error' : ''
                }`}
                label={this.props.label}
                inline={this.props.inline}
                disabled={this.props.disabled}
                helperText={helperText}
                intent={validationError ? 'warning' : 'none'}
            >
                {this.props.children}
            </FormGroup>
        );
    }
}
