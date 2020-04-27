import * as path from "path";
import {UserConfig} from "@/renderer/app/model/user-config";

export enum OperatingSystem {
    MACOS = "macOS",
    WINDOWS = "Windows",
    LINUX = "Linux"
}

export const getProjectDir = (configFilePath: string) => path.dirname(configFilePath);
export const getSourcesDir = (workspaceDir: string) => path.join(workspaceDir, "src");
export const getSourcesDirFromConfigPath = (configFilePath: string) => getSourcesDir(getProjectDir(configFilePath));
export const getDependenciesDirPath = (workspaceDir: string) => path.join(workspaceDir, "lib");
export const getIPlug2BaseDirPath = (workspaceDir: string) => path.join(getDependenciesDirPath(workspaceDir), "iPlug2");
export const getVst3SdkDirPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "IPlug", "VST3_SDK");
export const getWorkDirPath = (workspaceDir: string) => path.join(workspaceDir, ".work");
export const getIPlug2DependenciesPath = (workspaceDir: string) => path.join(getIPlug2BaseDirPath(workspaceDir), "Dependencies");
export const getIPlug2DependenciesBuildPath = (workspaceDir: string) => path.join(getIPlug2DependenciesPath(workspaceDir), "Build");
export const getProjectBuildPath = (workspaceDir: string) => path.join(workspaceDir, "build");
export const getVisualStudioSolutionFilePath = (workspaceDir: string, config: UserConfig) => path.join(getProjectBuildPath(workspaceDir), config.projectName, config.projectName + ".sln");

