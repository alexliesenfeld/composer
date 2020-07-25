import { WorkspaceMetadata } from '@/renderer/app/stores/app-store';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';

export class LocalStorageAdapter {
    public static registerRecentlyOpenedWorkspace(
        projectName: string,
        filePath: string,
    ): WorkspaceMetadata[] {
        LocalStorageAdapter.deregisterRecentlyOpenedWorkspace(filePath);
        const recentlyOpenedWorkspaces = [
            {
                projectName,
                filePath,
            },
            ...LocalStorageAdapter.readRecentlyOpenedWorkspaces(),
        ];
        if (recentlyOpenedWorkspaces.length > 5) {
            recentlyOpenedWorkspaces.pop();
        }
        localStorage.setItem('recentlyOpenedWorkspaces', JSON.stringify(recentlyOpenedWorkspaces));
        return recentlyOpenedWorkspaces;
    }

    public static deregisterRecentlyOpenedWorkspace(filePath: string): WorkspaceMetadata[] {
        const recentlyOpenedWorkspaces = LocalStorageAdapter.readRecentlyOpenedWorkspaces();
        const recentProjectIdx = recentlyOpenedWorkspaces.findIndex((e) => e.filePath === filePath);
        if (recentProjectIdx > -1) {
            recentlyOpenedWorkspaces.splice(recentProjectIdx, 1);
            localStorage.setItem(
                'recentlyOpenedWorkspaces',
                JSON.stringify(recentlyOpenedWorkspaces),
            );
        }
        return recentlyOpenedWorkspaces;
    }

    public static readRecentlyOpenedWorkspaces(): WorkspaceMetadata[] {
        const lastOpenedWorkspacesJson = localStorage.getItem('recentlyOpenedWorkspaces');
        if (!lastOpenedWorkspacesJson) {
            return [];
        }
        return JSON.parse(lastOpenedWorkspacesJson).filter((f: WorkspaceMetadata) =>
            fileExistsSync(f.filePath),
        );
    }
}
