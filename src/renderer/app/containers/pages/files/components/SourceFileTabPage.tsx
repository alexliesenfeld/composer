import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import { CreateOrRenameFileDialog } from '@/renderer/app/components/CreateRenameFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import { Alignment, Navbar, Text } from '@blueprintjs/core';

import * as React from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';

interface SourceFileTabPageProps {
    darkTheme: boolean;
    isCreateFileDialogOpen: boolean;
    onAcceptCreateFileDialog: (fileName: string) => void;
    onCancelCreateFileDialog: () => void;
    isRenameFileDialogOpen: boolean;
    onAcceptRenamingFileDialog: (fileName: string) => void;
    onCancelRenamingFileDialog: () => void;
    checkFileExists: (file: string) => boolean;
    fileToDelete: string | undefined;
    onCancelDeletingSourceFile: () => void;
    onConfirmDeleteFileDialog: () => void;
    sourceFileNamesList: string[];
    selectedFile: string | undefined;
    onFileSelected: (fileName: string) => void;
    onImportFile: () => void;
    onCreateNewItem: () => void;
    onDeleteItem: (fileName: string) => void;
    selectedSourceFileContent: string | undefined;
    codeEditorFontSize: number;
    onOpenInExternalEditor: (fileName: string) => void;
    onLocateFileInExplorer: (fileName: string) => void;
    onRenameFile: (fileName: string) => void;
    fileToRename?: string;
}

export const SourceFileTabPage = (props: SourceFileTabPageProps) => {
    return (
        <div className="SourceFileTabPage">
            {props.isCreateFileDialogOpen && (
                <CreateOrRenameFileDialog
                    mode={'create'}
                    initialValue={''}
                    isOpen={props.isCreateFileDialogOpen}
                    title={'Create file'}
                    onAccept={props.onAcceptCreateFileDialog}
                    onCancel={props.onCancelCreateFileDialog}
                    fileExists={props.checkFileExists}
                    allowedFileExtensions={['.h', '.hpp', '.cpp']}
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
                    allowedFileExtensions={['.h', '.hpp', '.cpp']}
                />
            )}

            {!!props.fileToDelete && (
                <ConfirmDeleteFileDialog
                    darkTheme={props.darkTheme}
                    fileName={props.fileToDelete}
                    onCancel={props.onCancelDeletingSourceFile}
                    onAccept={props.onConfirmDeleteFileDialog}
                />
            )}

            <FileBrowser
                showContentArea={true}
                fileList={props.sourceFileNamesList}
                selectedFile={props.selectedFile}
                onSelectFile={props.onFileSelected}
                onImportExistingItem={props.onImportFile}
                onCreateNewItem={props.onCreateNewItem}
                onDelete={props.onDeleteItem}
                onLocateFileInExplorer={props.onLocateFileInExplorer}
                onOpenInExternalEditor={props.onOpenInExternalEditor}
                onRenameFile={props.onRenameFile}
            >
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Text>{props.selectedFile}</Text>
                    </Navbar.Group>
                </Navbar>
                <AceEditor
                    className="source-file-editor"
                    placeholder="No content"
                    mode="c_cpp"
                    theme="tomorrow_night"
                    name="source-file-editor"
                    value={props.selectedSourceFileContent}
                    fontSize={props.codeEditorFontSize}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={false}
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 4,
                        readOnly: true,
                    }}
                />
            </FileBrowser>
        </div>
    );
};
