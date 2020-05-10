import { WorkspaceConfig } from '@/renderer/app/model/workspace-config';
import * as path from 'path';

export const CONFIG_HEADER_FILE_NAME = 'config.h';
export const DEFAULT_FONT_FILE_NAME = 'Roboto-Regular.ttf';

export class ProjectPaths {
    constructor(protected configFilePath: string) {}

    public getWorkspaceDir(): string {
        return path.dirname(this.configFilePath);
    }

    public getSourcesDir(): string {
        return path.join(this.getWorkspaceDir(), 'Source');
    }

    public getResourcesDir(): string {
        return path.join(this.getWorkspaceDir(), 'Resources');
    }

    public getFontsDir(): string {
        return path.join(this.getResourcesDir(), 'Fonts');
    }

    public getImagesDir(): string {
        return path.join(this.getResourcesDir(), 'Images');
    }

    public getDependenciesDirPath(): string {
        return path.join(this.getWorkspaceDir(), 'Dependencies');
    }

    public getIPlug2BaseDirPath(): string {
        return path.join(this.getDependenciesDirPath(), 'iPlug2');
    }

    public getVst3SdkDirPath(): string {
        return path.join(this.getIPlug2DependenciesPath(), 'IPlug', 'VST3_SDK');
    }

    public getIPlug2DependenciesPath(): string {
        return path.join(this.getIPlug2BaseDirPath(), 'Dependencies');
    }

    public getIPlug2DependenciesBuildPath(): string {
        return path.join(this.getIPlug2DependenciesPath(), 'Build');
    }

    public getBuildsDir(): string {
        return path.join(this.getWorkspaceDir(), 'Build');
    }
}

export class WorkspacePaths extends ProjectPaths {
    constructor(configFilePath: string, protected config: WorkspaceConfig) {
        super(configFilePath);
    }

    public getWorkDirPath(): string {
        return path.join(this.getWorkspaceDir(), '.work');
    }

    public getProjectBuildDir(): string {
        return path.join(this.getBuildsDir(), this.config.projectName.toString());
    }

    public getVisualStudioProjectResourcesDir(): string {
        return path.join(this.getProjectBuildDir(), 'resources');
    }

    public getIDEProjectFontResourcesDir(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), 'fonts');
    }

    public getIDEProjectImageResourcesDir(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), 'img');
    }

    public getVisualStudioProjectConfigDir(): string {
        return path.join(this.getProjectBuildDir(), 'config');
    }

    public getVisualStudioProjectWinPropsPath(): string {
        return path.join(
            this.getVisualStudioProjectConfigDir(),
            `${this.config.projectName}-win.props`,
        );
    }

    public getMainRcPath(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), 'main.rc');
    }

    public getConfigHPath(): string {
        return path.join(this.getProjectBuildDir(), CONFIG_HEADER_FILE_NAME);
    }

    public getMainPluginCppFile(): string {
        return path.join(this.getSourcesDir(), `${this.config.projectName}.cpp`);
    }

    public getVisualStudioSolutionFilePath(): string {
        return path.join(this.getProjectBuildDir(), this.config.projectName + '.sln');
    }

    public getVisualStudioIDEProjectsDir(): string {
        return path.join(this.getProjectBuildDir(), 'projects');
    }

    public getVisualStudioAppIDEProjectFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-app.vcxproj',
        );
    }

    public getVisualStudioAppIDEProjectFiltersFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-app.vcxproj.filters',
        );
    }

    public getVisualStudioAaxIDEProjectFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-aax.vcxproj',
        );
    }

    public getVisualStudioAaxIDEProjectFiltersFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-aax.vcxproj.filters',
        );
    }

    public getVisualStudioVst2IDEProjectFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-vst2.vcxproj',
        );
    }

    public getVisualStudioVst2IDEProjectFiltersFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-vst2.vcxproj.filters',
        );
    }

    public getVisualStudioVst3IDEProjectFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-vst3.vcxproj',
        );
    }

    public getVisualStudioVst3IDEProjectFiltersFilePath(): string {
        return path.join(
            this.getVisualStudioIDEProjectsDir(),
            this.config.projectName + '-vst3.vcxproj.filters',
        );
    }
}
