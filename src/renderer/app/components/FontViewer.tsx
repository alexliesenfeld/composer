import { loremIpsum } from '@/renderer/app/util/string-utils';
import { Slider } from '@blueprintjs/core';
import * as React from 'react';

const FONT_NAME = 'CurrentFontViewerFont';

interface FontViewerProps {
    fontFileBuffer: Buffer;
    fontSize: number;
    onFontSizeChanged: (value: number) => void;
}

export class FontViewer extends React.Component<FontViewerProps> {
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
            <div className="FontViewer">
                <Slider
                    min={0}
                    max={100}
                    stepSize={1}
                    labelStepSize={10}
                    onChange={this.props.onFontSizeChanged}
                    value={this.props.fontSize}
                />
                <div
                    className="font-presentation-area"
                    style={{
                        fontFamily: FONT_NAME,
                        fontSize: this.props.fontSize,
                    }}
                >
                    {loremIpsum}
                </div>
            </div>
        );
    }
}
