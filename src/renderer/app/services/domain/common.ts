import * as path from "path";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";

export enum OperatingSystem {
    MACOS = "macOS",
    WINDOWS = "Windows",
    LINUX = "Linux"
}

export const CONFIG_HEADER_FILE_NAME = 'config.h';
export const DEFAULT_FONT_FILE_NAME = 'Roboto-Regular.ttf';

export const getWorkspaceDir = (configFilePath: string) => path.dirname(configFilePath);
export const getSourcesDir = (workspaceDir: string) => path.join(workspaceDir, "Source");
export const getSourcesDirFromConfigPath = (configFilePath: string) => getSourcesDir(getWorkspaceDir(configFilePath));
export const getResourcesDir = (workspaceDir: string) => path.join(workspaceDir, "Resources");
export const getResourcesDirFromConfigPath = (workspaceDir: string) => getResourcesDir(getWorkspaceDir(workspaceDir));
export const getFontsDir = (workspaceDir: string) => path.join(getResourcesDir(workspaceDir), "Fonts");
export const getFontsDirFromConfigPath = (configFilePath: string) => getFontsDir(getWorkspaceDir(configFilePath));
export const getImagesDir = (workspaceDir: string) => path.join(getResourcesDir(workspaceDir), "Images");
export const getImagesDirFromConfigPath = (configFilePath: string) => getImagesDir(getWorkspaceDir(configFilePath));
export const getDependenciesDirPath = (workspaceDir: string) => path.join(workspaceDir, "Dependencies");
export const getIPlug2BaseDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "iPlug2");
export const getVst3SdkDirPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "IPlug", "VST3_SDK");
export const getWorkDirPath = (workspaceDir: string) => path.join(workspaceDir, ".work");
export const getIPlug2DependenciesPath = (workspaceDir: string) => path.join(getIPlug2BaseDirPath(workspaceDir), "Dependencies");
export const getIPlug2DependenciesBuildPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "Build");
export const getBuildsDir = (workspaceDir: string) => path.join(workspaceDir, "Build");
export const getProjectBuildDir = (workspaceDir: string, os: OperatingSystem) => path.join(getBuildsDir(workspaceDir), os.toString());
export const getVisualStudioProjectResourcesDir = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getProjectBuildDir(workspaceDir, os), "resources");
export const getVisualStudioProjectFontResourcesDir = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioProjectResourcesDir(workspaceDir, config, os), "fonts");

export const getVisualStudioProjectConfigDir = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getProjectBuildDir(workspaceDir, os), "config");
export const getVisualStudioProjectWinPropsPath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioProjectConfigDir(workspaceDir, config, os), `${config.projectName}-win.props`);


export const getMainRcPath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioProjectResourcesDir(workspaceDir, config, os), "main.rc");
export const getConfigHPath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getSourcesDir(workspaceDir), CONFIG_HEADER_FILE_NAME);
export const getMainPluginCppFile = (workspaceDir: string, config: WorkspaceConfig) => path.join(getSourcesDir(workspaceDir), `${config.projectName}.cpp`);

export const getVisualStudioSolutionFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getProjectBuildDir(workspaceDir, os), config.projectName + ".sln");
export const getVisualStudioIDEProjectsDir = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getProjectBuildDir(workspaceDir, os), "projects");
export const getVisualStudioAppIDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-app.vcxproj");
export const getVisualStudioAppIDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-app.vcxproj.filters");
export const getVisualStudioAaxIDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-aax.vcxproj");
export const getVisualStudioAaxIDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-aax.vcxproj.filters");
export const getVisualStudioVst2IDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-vst2.vcxproj");
export const getVisualStudioVst2IDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-vst2.vcxproj.filters");
export const getVisualStudioVst3IDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-vst3.vcxproj");
export const getVisualStudioVst3IDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig, os: OperatingSystem) => path.join(getVisualStudioIDEProjectsDir(workspaceDir, config, os), config.projectName + "-vst3.vcxproj.filters");




