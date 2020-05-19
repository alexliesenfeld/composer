export class CustomError extends Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(type: any, message?: string) {
        super(message);
        // see: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // see: https://joefallon.net/2018/09/typescript-try-catch-finally-and-custom-errors/
        Object.setPrototypeOf(this, type.prototype);
        this.name = type.name;
    }
}

export class ValidationError extends CustomError {
    constructor(public message: string) {
        super(ValidationError, message);
    }
}

export class DirectoryNotEmptyError extends CustomError {
    constructor(public customMessage?: string, public filePath?: string) {
        super(
            DirectoryNotEmptyError,
            customMessage
                ? customMessage
                : `Directory is not empty${filePath ? ': ' + filePath : ''}.`,
        );
    }
}

export class SavingError extends CustomError {
    constructor(public customMessage?: string) {
        super(SavingError, customMessage ? customMessage : `Could not save.`);
    }
}

export class FileNotFoundError extends CustomError {
    constructor(public filePath?: string) {
        super(FileNotFoundError, 'File was not found' + (filePath ? ': ' + filePath : '') + '.');
    }
}

export class OperationFailedError extends CustomError {
    constructor(public customMessage?: string) {
        super(OperationFailedError, customMessage ? customMessage : `Operation has failed.`);
    }
}

export class CommandFailedError extends CustomError {
    constructor(
        public command: string,
        public args: string[],
        public output: string,
        public errorOutput: string,
        public statusCode: number | null,
    ) {
        super(
            CommandFailedError,
            `Command "${command} ${args.join(
                ' ',
            )}" failed with error code "${statusCode}". Output: ${output}, Error output: "${errorOutput}".`,
        );
    }
}

export class UnsupportedOperationError extends CustomError {
    constructor(public customMessage?: string) {
        super(
            UnsupportedOperationError,
            customMessage ? customMessage : `Operation is unsupported.`,
        );
    }
}

export class AssertionError extends CustomError {
    constructor(public customMessage?: string) {
        super(AssertionError, customMessage ? customMessage : `Assertion error.`);
        this.message += ` Stack: ${this.stack}`;
    }
}
