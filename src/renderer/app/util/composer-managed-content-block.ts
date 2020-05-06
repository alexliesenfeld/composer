import { EOL } from 'ts-loader/dist/constants';

const HEADER_FILE_COMPOSER_BLOCK_START = `// ***************************** COMPOSER MANAGED BLOCK - START *****************************${EOL}`;
const HEADER_FILE_COMPOSER_BLOCK_END = `// ****************************** COMPOSER MANAGED BLOCK - END ******************************${EOL}`;
const HEADER_FILE_COMPOSER_BLOCK_COMMENT = `// This section is managed by Composer. If you make changes here, they might get lost.${EOL}`;

export class ComposerManagedContentBlock {
    constructor(public readonly payload: string) {}

    public static extractFrom(content: string): ComposerManagedContentBlock {
        const startIdx = content.indexOf(HEADER_FILE_COMPOSER_BLOCK_START);
        const endIdx = content.indexOf(HEADER_FILE_COMPOSER_BLOCK_END);

        if (startIdx === -1 || endIdx === -1) {
            return new ComposerManagedContentBlock('');
        }

        const payload = content
            .substring(startIdx, endIdx)
            .replace(HEADER_FILE_COMPOSER_BLOCK_START, '')
            .replace(HEADER_FILE_COMPOSER_BLOCK_END, '')
            .replace(HEADER_FILE_COMPOSER_BLOCK_COMMENT, '');

        return new ComposerManagedContentBlock(payload);
    }

    public addToOrReplaceIn(content: string) {
        const block =
            HEADER_FILE_COMPOSER_BLOCK_START +
            HEADER_FILE_COMPOSER_BLOCK_COMMENT +
            this.payload +
            HEADER_FILE_COMPOSER_BLOCK_END;

        const startIdx = content.indexOf(HEADER_FILE_COMPOSER_BLOCK_START);
        const endIdx = content.lastIndexOf(HEADER_FILE_COMPOSER_BLOCK_END);

        if (startIdx >= 0 && endIdx >= 0) {
            const oldBlock = content.substring(startIdx, endIdx + HEADER_FILE_COMPOSER_BLOCK_END.length);

            return content.replace(oldBlock, block);
        }

        return `${content}${EOL}${block}`;
    }
}
