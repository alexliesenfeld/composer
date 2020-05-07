import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import { ImageViewer } from '@/renderer/app/components/ImageViewer';
import { ImageHelpPanel } from '@/renderer/app/containers/pages/files/info-panels/ImageHelpPanel';
import { Alignment, Button, Navbar, Text } from '@blueprintjs/core';
import { HELP } from '@blueprintjs/icons/lib/esm/generated/iconNames';
import * as React from 'react';

interface ImageFileTabPageProps {
    darkTheme: boolean;
    fileToDelete: string | undefined;
    onCancelDeletingFile: () => void;
    onCompleteDeletingFile: () => void;
    files: string[];
    selectedFile: string | undefined;
    onFileSelected: (fileName: string) => void;
    selectedFileContent: string | undefined;
    getVariableForFile: (fileName: string) => string;
    onImportFile: () => void;
    onDeleteFile: (fileName: string) => void;
    infoPanelOpened: boolean;
    onInfoPanelClose: () => void;
    onInfoPanelOpen: () => void;
}

export const ImageFileTabPage = (props: ImageFileTabPageProps) => {
    return (
        <div className="ImageFileTabPage">
            <ConfirmDeleteFileDialog
                darkTheme={props.darkTheme}
                fileName={props.fileToDelete}
                onCancel={props.onCancelDeletingFile}
                onAccept={props.onCompleteDeletingFile}
            />
            {!!props.selectedFile && props.infoPanelOpened ? (
                <ImageHelpPanel
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
                <ImageViewer
                    fileName={props.selectedFile}
                    imageFileBuffer={props.selectedFileContent}
                />
            </FileBrowser>
        </div>
    );
};
