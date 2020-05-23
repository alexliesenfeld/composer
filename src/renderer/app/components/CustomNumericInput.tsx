import { NumericInput } from '@blueprintjs/core';
import * as React from 'react';

export interface CustomNumericInputProps {
    fill?: boolean;
    value: number;
    disabled?: boolean;
    onValueChange(valueAsNumber: number | undefined): void;
}

export class CustomNumericInput extends React.Component<CustomNumericInputProps> {
    render() {
        const onValueChange = (valueAsNumber: number, valueAsString: string) => {
            if (valueAsNumber.toString() === valueAsString) {
                this.props.onValueChange(valueAsNumber);
            } else {
                this.props.onValueChange(undefined);
            }
        };

        return (
            <NumericInput
                fill={this.props.fill}
                value={this.props.value}
                disabled={this.props.disabled}
                onValueChange={onValueChange}
            />
        );
    }
}
