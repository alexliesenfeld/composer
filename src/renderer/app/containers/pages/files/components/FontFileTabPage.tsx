import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import { FontViewer } from '@/renderer/app/components/FontViewer';
import { FontHelpPanel } from '@/renderer/app/containers/pages/files/info-panels/FontHelpPanel';
import { Alignment, Button, Navbar, Text } from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';

interface FontFileTabPageProps {
    darkTheme: boolean;
    isCreateFileDialogOpen: boolean;
    onAcceptCreateFileDialog: (fileName: string) => void;
    onCancelCreateFileDialog: () => void;
    checkFileExists: (file: string) => boolean;
    fileToDelete: string | undefined;
    onCancelDeletingFile: () => void;
    onConfirmDeleteFileDialog: () => void;
    files: string[];
    selectedFile: string | undefined;
    onFileSelected: (fileName: string) => void;
    selectedFileContent: Buffer | undefined;
    selectedFileVariable: string | undefined;
    onImportFile: () => void;
    onCreateNewFile: () => void;
    onDeleteFile: (fileName: string) => void;

    infoPanelOpened: boolean;
    onInfoPanelClose: () => void;
    onInfoPanelOpen: () => void;

    fontSize: number;
    onFontSizeChanged: () => void;
}

export const FontFileTabPage = (props: FontFileTabPageProps) => {
    return (
        <div className="FontFileTabPage">
            <ConfirmDeleteFileDialog
                darkTheme={props.darkTheme}
                fileName={props.fileToDelete}
                onCancel={props.onCancelDeletingFile}
                onAccept={props.onConfirmDeleteFileDialog}
            />
            {!!props.selectedFile && props.infoPanelOpened ? (
                <FontHelpPanel
                    fileName={props.selectedFile}
                    variableName={props.selectedFileVariable!}
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
