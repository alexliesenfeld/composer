import * as React from 'react';
import {Spinner} from "@blueprintjs/core";

export const SpinnerPanel = (props: { loading: boolean, loadingText?: string }) => {
    if (props.loading) {
        return <div className='SpinnerPanel' >
            <Spinner intent={"none"} size={50}/>
            <h3 className='text'>{props.loadingText ? props.loadingText : ''}</h3>
        </div>;
    }
    return <div style={{display: "none"}}/>;
};
