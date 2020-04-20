import {values} from "mobx";


export class CustomError extends Error {
    constructor(type: any, message?: string) {
        super(message);
        // see: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // see: https://joefallon.net/2018/09/typescript-try-catch-finally-and-custom-errors/
        Object.setPrototypeOf(this, type.prototype);
        this.name = type.name;
    }
}

export class DirectoryNotEmptyError extends CustomError {
    constructor(public customMessage?: string, public filePath?: string) {
        super(DirectoryNotEmptyError, customMessage ? customMessage : `Directory is not empty${filePath ? ': ' + filePath : ''}.`);
    }
}

export class FileNotFoundError extends CustomError {
    constructor(public filePath?: string) {
        super(FileNotFoundError, "File was not found" + (filePath ? ": " + filePath : '')  + ".");
    }
}

export class OperationFailedError extends CustomError {
    constructor(public customMessage?: string) {
        super(OperationFailedError, customMessage ? customMessage : `Operation has failed.`);
    }
}
