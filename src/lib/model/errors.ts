export class CustomError extends Error {
    constructor(type: any, message?: string) {
        super();
        // see: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // see: https://joefallon.net/2018/09/typescript-try-catch-finally-and-custom-errors/
        Object.setPrototypeOf(this, type.prototype);
        this.name = type.name;
    }
}


export class EmptyFileError extends CustomError {
    constructor(public filePath?: string) {
        super(EmptyFileError, "File is empty");
    }
}

export class FileNotFoundError extends CustomError {
    constructor(public filePath?: string) {
        super(FileNotFoundError, "File not found");
    }
}

export class IllegalStateError extends CustomError {
    constructor(public errorMessage?: string) {
        super(IllegalStateError, errorMessage);
    }
}

export class NotInitializedError extends CustomError {
    constructor(public errorMessage?: string) {
        super(NotInitializedError, errorMessage);
    }
}
