import * as React from 'react';
import {PureComponent} from 'react';
import {loremIpsum} from "@/renderer/app/util/string-utils";

const FONT_NAME = "CurrentFontViewerFont";

interface FontViewerProps {
    fontFileBuffer: Buffer
    fontSize: number
}

export class FontViewer extends PureComponent<FontViewerProps> {

    async componentDidUpdate(): Promise<void> {
        return this.loadFont();
    }

    async componentDidMount(): Promise<void> {
        return this.loadFont();
    }

    async loadFont(): Promise<void> {
        const data = Uint8Array.from(this.props.fontFileBuffer).buffer;
        const font = new FontFace(FONT_NAME, data);
        const fontFace = await font.load();
        document.fonts.add(fontFace);
    }

    render() {
        return (
            <div className='FontViewer'>
                <div className='font-presentation-area' style={{fontFamily: FONT_NAME, fontSize: this.props.fontSize}}>{loremIpsum}</div>
            </div>

        );
    }
}
