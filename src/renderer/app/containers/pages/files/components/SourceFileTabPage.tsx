import { ConfirmDeleteFileDialog } from '@/renderer/app/components/ConfirmDeleteFileDialog';
import CreateFileDialog from '@/renderer/app/components/CreateNewFileDialog';
import { FileBrowser } from '@/renderer/app/components/FileBrowser';
import * as React from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';

interface SourceFileTabPageProps {
    darkTheme: boolean;
    isCreateFileDialogOpen: boolean;
    onAcceptCreateSourceFileDialog: (fileName: string) => void;
    onCancelCreateSourceFileDialog: () => void;
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
}

export const SourceFileTabPage = (props: SourceFileTabPageProps) => {
    return (
        <div className="SourceFileTabPage">
            <CreateFileDialog
                isOpen={props.isCreateFileDialogOpen}
                title={'Create new source file'}
                onAccept={props.onAcceptCreateSourceFileDialog}
                onCancel={props.onCancelCreateSourceFileDialog}
                fileExists={props.checkFileExists}
                allowedFileExtensions={['.h', '.hpp', '.cpp']}
            />
            <ConfirmDeleteFileDialog
                darkTheme={props.darkTheme}
                fileName={props.fileToDelete}
                onCancel={props.onCancelDeletingSourceFile}
                onAccept={props.onConfirmDeleteFileDialog}
            />
            <FileBrowser
                showContentArea={true}
                fileList={props.sourceFileNamesList}
                selectedFile={props.selectedFile}
                onSelectFile={props.onFileSelected}
                onImportExistingItem={props.onImportFile}
                onCreateNewItem={props.onCreateNewItem}
                onDelete={props.onDeleteItem}
            >
                <AceEditor
                    style={{ width: '100%', height: '100%' }}
                    placeholder="No content"
                    mode="c_cpp"
                    theme="tomorrow_night"
                    name="source-file-editor"
                    value={props.selectedSourceFileContent}
                    fontSize={16}
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
