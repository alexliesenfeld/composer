import { ProjectPaths } from '@/renderer/app/services/domain/common/paths';
import { expect } from 'chai';
import * as path from 'path';

describe('Generating Paths', () => {
    it('creating source directory path', () => {
        // Arrange
        const configFilePath = path.join('parentDir', 'composer.json');
        const expected = path.join('parentDir', 'Source');

        // Act
        const actual = new ProjectPaths(configFilePath).getSourcesDir();

        // Assert
        expect(actual).to.equal(expected);
    });
});
