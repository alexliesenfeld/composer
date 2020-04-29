import * as path from "path";
import {WorkspaceConfig} from "@/renderer/app/model/workspace-config";

export enum OperatingSystem {
    MACOS = "macOS",
    WINDOWS = "Windows",
    LINUX = "Linux"
}

export const getWorkspaceDir = (configFilePath: string) => path.dirname(configFilePath);
export const getSourcesDir = (workspaceDir: string) => path.join(workspaceDir, "src");
export const getSourcesDirFromConfigPath = (configFilePath: string) => getSourcesDir(getWorkspaceDir(configFilePath));
export const getResourcesDir = (workspaceDir: string) => path.join(workspaceDir, "resources");
export const getResourcesDirFromConfigPath = (workspaceDir: string) => path.join(getWorkspaceDir(workspaceDir), "resources");
export const getFontsDir = (workspaceDir: string) => path.join(getResourcesDir(workspaceDir), "fonts");
export const getFontsDirFromConfigPath = (configFilePath: string) => getFontsDir(getWorkspaceDir(configFilePath));
export const getImagesDir = (workspaceDir: string) => path.join(getResourcesDir(workspaceDir), "images");
export const getImagesDirFromConfigPath = (configFilePath: string) => getImagesDir(getWorkspaceDir(configFilePath));
export const getDependenciesDirPath = (workspaceDir: string) => path.join(workspaceDir, "lib");
export const getIPlug2BaseDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "iPlug2");
export const getVst3SdkDirPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "IPlug", "VST3_SDK");
export const getWorkDirPath = (workspaceDir: string) => path.join(workspaceDir, ".work");
export const getIPlug2DependenciesPath = (workspaceDir: string) => path.join(getIPlug2BaseDirPath(workspaceDir), "Dependencies");
export const getIPlug2DependenciesBuildPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "Build");
export const getProjectBuildPath = (workspaceDir: string) => path.join(workspaceDir, "build");
export const getVisualStudioSolutionDirPath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getProjectBuildPath(workspaceDir), config.projectName);
export const getVisualStudioSolutionFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioSolutionDirPath(workspaceDir, config), config.projectName + ".sln");
export const getVisualStudioIDEProjectsFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioSolutionDirPath(workspaceDir, config), "projects");
export const getVisualStudioAppIDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-app.vcxproj");
export const getVisualStudioAppIDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-app.vcxproj.filters");
export const getVisualStudioAaxIDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-aax.vcxproj");
export const getVisualStudioAaxIDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-aax.vcxproj.filters");
export const getVisualStudioVst2IDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-vst2.vcxproj");
export const getVisualStudioVst2IDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-vst2.vcxproj.filters");
export const getVisualStudioVst3IDEProjectFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-vst3.vcxproj");
export const getVisualStudioVst3IDEProjectFiltersFilePath = (workspaceDir: string, config: WorkspaceConfig) => path.join(getVisualStudioIDEProjectsFilePath(workspaceDir, config), config.projectName + "-vst3.vcxproj.filters");


