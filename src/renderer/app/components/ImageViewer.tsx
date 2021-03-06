import { When } from '@/renderer/app/components/When';
import { UnsupportedOperationError } from '@/renderer/app/model/errors';
import * as path from 'path';
import * as React from 'react';

interface ImageViewerProps {
    imageFileBuffer: string | undefined;
    fileName: string | undefined;
}

export class ImageViewer extends React.Component<ImageViewerProps> {
    render() {
        return (
            <div className="ImageViewer">
                <When condition={!!this.props.fileName && !!this.props.imageFileBuffer}>
                    <img
                        src={`data:${this.getMimeType(this.props.fileName!)};base64,${
                            this.props.imageFileBuffer
                        }`}
                        alt={'No image available'}
                    />
                </When>
            </div>
        );
    }

    getMimeType(fileName: string) {
        const ext = path.extname(fileName);
        if (ext === '.png') {
            return 'image/png';
        } else {
            throw new UnsupportedOperationError(
                `Unsupported image file extension ${ext} in file ${fileName}`,
            );
        }
    }
}
