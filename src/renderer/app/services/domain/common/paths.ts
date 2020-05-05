import * as path from "path";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";

export const CONFIG_HEADER_FILE_NAME = 'config.h';
export const DEFAULT_FONT_FILE_NAME = 'Roboto-Regular.ttf';

export class ProjectPaths {
    constructor(protected configFilePath: string) {

    }

    getWorkspaceDir(): string {
        return path.dirname(this.configFilePath)
    }

    getSourcesDir(): string {
        return path.join(this.getWorkspaceDir(), "Source")
    }

    getResourcesDir(): string {
        return path.join(this.getWorkspaceDir(), "Resources")
    }

    getFontsDir(): string {
        return path.join(this.getResourcesDir(), "Fonts")
    }

    getImagesDir(): string {
        return path.join(this.getResourcesDir(), "Images")
    }

    getDependenciesDirPath(): string {
        return path.join(this.getWorkspaceDir(), "Dependencies")
    }

    getIPlug2BaseDirPath(): string {
        return path.join(this.getDependenciesDirPath(), "iPlug2")
    }

    getVst3SdkDirPath(): string {
        return path.join(this.getIPlug2DependenciesPath(), "IPlug", "VST3_SDK")
    }

    getIPlug2DependenciesPath(): string {
        return path.join(this.getIPlug2BaseDirPath(), "Dependencies")
    }

    getIPlug2DependenciesBuildPath(): string {
        return path.join(this.getIPlug2DependenciesPath(), "Build")
    }

    getBuildsDir(): string {
        return path.join(this.getWorkspaceDir(), "Build")
    }

}

export class WorkspacePaths extends ProjectPaths {

    constructor(configFilePath: string, protected config: WorkspaceConfig) {
        super(configFilePath);
    }

    getWorkDirPath(): string {
        return path.join(this.getWorkspaceDir(), ".work")
    }

    getProjectBuildDir(): string {
        return path.join(this.getBuildsDir(), this.config.projectName.toString())
    }

    getVisualStudioProjectResourcesDir(): string {
        return path.join(this.getProjectBuildDir(), "resources")
    }

    getIDEProjectFontResourcesDir(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), "fonts")
    }

    getIDEProjectImageResourcesDir(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), "img")
    }

    getVisualStudioProjectConfigDir(): string {
        return path.join(this.getProjectBuildDir(), "config")
    }

    getVisualStudioProjectWinPropsPath(): string {
        return path.join(this.getVisualStudioProjectConfigDir(), `${this.config.projectName}-win.props`)
    }

    getMainRcPath(): string {
        return path.join(this.getVisualStudioProjectResourcesDir(), "main.rc")
    }

    getConfigHPath(): string {
        return path.join(this.getSourcesDir(), CONFIG_HEADER_FILE_NAME)
    }

    getMainPluginCppFile(): string {
        return path.join(this.getSourcesDir(), `${this.config.projectName}.cpp`)
    }

    getVisualStudioSolutionFilePath(): string {
        return path.join(this.getProjectBuildDir(), this.config.projectName + ".sln")
    }

    getVisualStudioIDEProjectsDir(): string {
        return path.join(this.getProjectBuildDir(), "projects")
    }

    getVisualStudioAppIDEProjectFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-app.vcxproj")
    }

    getVisualStudioAppIDEProjectFiltersFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-app.vcxproj.filters")
    }

    getVisualStudioAaxIDEProjectFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-aax.vcxproj")
    }

    getVisualStudioAaxIDEProjectFiltersFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-aax.vcxproj.filters")
    }

    getVisualStudioVst2IDEProjectFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-vst2.vcxproj")
    }

    getVisualStudioVst2IDEProjectFiltersFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-vst2.vcxproj.filters")
    }

    getVisualStudioVst3IDEProjectFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-vst3.vcxproj")
    }

    getVisualStudioVst3IDEProjectFiltersFilePath(): string {
        return path.join(this.getVisualStudioIDEProjectsDir(), this.config.projectName + "-vst3.vcxproj.filters")
    }

}
