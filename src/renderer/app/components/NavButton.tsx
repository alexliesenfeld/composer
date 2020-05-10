import { Page } from '@/renderer/app/stores/app-store';
import { Button, Classes, IconName } from '@blueprintjs/core';
import * as React from 'react';

export const NavButton = (props: {
    text?: string;
    target: Page;
    icon: IconName;
    selectedPage: Page;
    onPageSelected: (page: Page) => void;
    disabled?: boolean;
}) => {
    const onClick = () => {
        props.onPageSelected(props.target);
    };

    return (
        <Button
            onClick={onClick}
            intent={props.selectedPage === props.target ? 'primary' : 'none'}
            className={Classes.MINIMAL}
            icon={props.icon}
            text={props.text}
            disabled={props.disabled}
        />
    );
};
