import * as React from 'react';
import {ItemRenderer, Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

export interface SelectInputItem<T> {
    key: T;
    text: string;
}

const stringItemRenderer: ItemRenderer<SelectInputItem<any>> = (item: SelectInputItem<any>, {handleClick, modifiers, query}) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }

    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            //label={itemText}
            key={item.key}
            onClick={handleClick}
            text={item.text} shouldDismissPopover={false}
        />
    );
};


export const SelectInput = <T extends unknown>(props: { items: SelectInputItem<T>[], selectedItemKey: T, onClick: (item: SelectInputItem<T>) => void }) => {
    const TypedSelect = Select.ofType<SelectInputItem<T>>();

    const selectedItem = props.items.find(e => e.key == props.selectedItemKey);

    return (
        <TypedSelect className='SelectInput'
                     items={props.items}
                     onItemSelect={(item) => props.onClick(item)}
                     itemRenderer={stringItemRenderer}
                     filterable={false} popoverProps={{fill: true, minimal: true, popoverClassName: 'height-constrained-popover custom-scrollbar' }}
                     activeItem={selectedItem}>
            <Button
                fill={true}
                alignText={"left"}
                rightIcon="caret-down"
                text={selectedItem ? selectedItem.text : 'Please select'}/>
        </TypedSelect>
    );
};


