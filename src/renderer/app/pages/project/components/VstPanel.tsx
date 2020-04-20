import * as React from 'react';
import {Card, Divider, Elevation, FormGroup, H5, InputGroup} from "@blueprintjs/core";
import {AudioUnitPluginType, Prototype, Vst3Subcategory} from "@/renderer/app/model/user-config";
import {SelectInput} from "@/renderer/app/components/SelectInput";
import {enumValues} from "@/renderer/app/util/enum-utils";

export interface VstPanelProps {
    vst3Subcategory: Vst3Subcategory,
    setVst3Subcategory: (value: Vst3Subcategory) => void,
    vst3UniqueId: string,
    setVst3UniqueId: (value: string) => void,
}

const VstPanel = (props: VstPanelProps) => {
    return (
        <Card elevation={Elevation.TWO}>
            <H5>Virtual Studio Technology (VST)</H5>
            <Divider/>
            <div className='row'>
                <FormGroup className='left-column' label="Unique Plug-In ID" labelFor="text-input">
                    <InputGroup placeholder="Please enter the name of the plug-in"
                                value={props.vst3UniqueId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setVst3UniqueId(e.target.value)}/>
                </FormGroup>
                <FormGroup className='right-column' label="Bundle Name" labelFor="text-input" >
                    <SelectInput items={enumValues(Vst3Subcategory).map((e) => ({key: e, text: e}))}
                                 selectedItemKey={props.vst3Subcategory}
                                 onClick={(item) => props.setVst3Subcategory(item.key)}

                    />
                </FormGroup>

            </div>
        </Card>
    );
};

export default VstPanel;
