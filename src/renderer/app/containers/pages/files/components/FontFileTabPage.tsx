import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import { CreateOrRenameFileDialog } from '@/renderer/app/components/CreateRenameFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import { FontViewer } from '@/renderer/app/components/FontViewer';
import { FontHelpPanel } from '@/renderer/app/containers/pages/files/info-panels/FontHelpPanel';
import { Alignment, Button, Navbar, Text } from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';

interface FontFileTabPageProps {
    darkTheme: boolean;
    fileToDelete: string | undefined;
    onCancelDeletingFile: () => void;
    onCompleteDeletingFile: () => void;
    isRenameFileDialogOpen: boolean;
    onAcceptRenamingFileDialog: (fileName: string) => void;
    onCancelRenamingFileDialog: () => void;
    checkFileExists: (file: string) => boolean;
    files: string[];
    selectedFile: string | undefined;
    onFileSelected: (fileName: string) => void;
    selectedFileContent: Buffer | undefined;
    getVariableForFile: (fileName: string) => string;
    onImportFile: () => void;
    onDeleteFile: (fileName: string) => void;
    infoPanelOpened: boolean;
    onInfoPanelClose: () => void;
    onInfoPanelOpen: () => void;
    fontSize: number;
    onFontSizeChanged: (size: number) => void;
    onOpenInExternalEditor: (fileName: string) => void;
    onLocateFileInExplorer: (fileName: string) => void;
    onRenameFile: (fileName: string) => void;
    fileToRename?: string;
}

export const FontFileTabPage = (props: FontFileTabPageProps) => {
    return (
        <div className="FontFileTabPage">
            {props.fileToDelete && (
                <ConfirmDeleteFileDialog
                    darkTheme={props.darkTheme}
                    fileName={props.fileToDelete}
                    onCancel={props.onCancelDeletingFile}
                    onAccept={props.onCompleteDeletingFile}
                />
            )}

            {!!props.fileToRename && (
                <CreateOrRenameFileDialog
                    mode={'rename'}
                    initialValue={props.fileToRename}
                    isOpen={props.isRenameFileDialogOpen}
                    title={'Rename file'}
                    onAccept={props.onAcceptRenamingFileDialog}
                    onCancel={props.onCancelRenamingFileDialog}
                    fileExists={props.checkFileExists}
                    allowedFileExtensions={['.ttf']}
                />
            )}

            {!!props.selectedFile && props.infoPanelOpened ? (
                <FontHelpPanel
                    fileName={props.selectedFile}
                    variableName={props.getVariableForFile(props.selectedFile)}
                    isOpen={props.infoPanelOpened}
                    onClose={props.onInfoPanelClose}
                />
            ) : null}

            <FileBrowser
                showContentArea={!!props.selectedFile}
                fileList={props.files}
                selectedFile={props.selectedFile}
                onSelectFile={props.onFileSelected}
                onImportExistingItem={props.onImportFile}
                onDelete={props.onDeleteFile}
                onLocateFileInExplorer={props.onLocateFileInExplorer}
                onOpenInExternalEditor={props.onOpenInExternalEditor}
                onRenameFile={props.onRenameFile}
            >
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Text>{props.selectedFile}</Text>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <Button
                            small={true}
                            minimal={true}
                            icon={HELP}
                            onClick={props.onInfoPanelOpen}
                        >
                            How to use?
                        </Button>
                    </Navbar.Group>
                </Navbar>
                <FontViewer
                    fontFileBuffer={props.selectedFileContent!}
                    fontSize={props.fontSize}
                    onFontSizeChanged={props.onFontSizeChanged}
                />
            </FileBrowser>
        </div>
    );
};
