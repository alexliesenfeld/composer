import * as React from 'react';

export class When extends React.Component<{ condition: boolean }> {
    render() {
        if (!this.props.condition) {
            return null;
        }
        return this.props.children;
    }
}
