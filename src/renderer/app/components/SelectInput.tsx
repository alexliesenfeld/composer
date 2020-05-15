import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { IItemRendererProps } from '@blueprintjs/select/src/common/itemRenderer';
import * as React from 'react';

export type KeyType = string | number | undefined;

export interface SelectInputItem<KeyType> {
    key: KeyType;
    text: string;
}
const TypedSelect = Select.ofType<SelectInputItem<KeyType>>();

const stringItemRenderer = (
    item: SelectInputItem<KeyType>,
    itemRendererProps: IItemRendererProps,
) => {
    if (!itemRendererProps.modifiers.matchesPredicate) {
        return null;
    }

    return (
        <MenuItem
            active={itemRendererProps.modifiers.active}
            disabled={itemRendererProps.modifiers.disabled}
            key={item.key}
            onClick={itemRendererProps.handleClick}
            text={item.text}
            shouldDismissPopover={false}
        />
    );
};

export const SelectInput = (props: {
    items: SelectInputItem<KeyType>[];
    selectedItemKey: KeyType;
    onClick: (item: SelectInputItem<KeyType>) => void;
}) => {
    const selectedItem = props.items.find((e) => e.key == props.selectedItemKey);
    const onItemSelect = (item: SelectInputItem<KeyType>) => {
        props.onClick(item);
    };

    return (
        <TypedSelect
            className="SelectInput"
            items={props.items}
            onItemSelect={onItemSelect}
            itemRenderer={stringItemRenderer}
            filterable={false}
            popoverProps={{
                fill: true,
                minimal: true,
                popoverClassName: 'height-constrained-popover custom-scrollbar',
                usePortal: false,
            }}
            activeItem={selectedItem}
        >
            <Button
                fill={true}
                alignText={'left'}
                rightIcon="caret-down"
                text={selectedItem ? selectedItem.text : 'Please select'}
            />
        </TypedSelect>
    );
};
