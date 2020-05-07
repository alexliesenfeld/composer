export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    ERROR = 'ERROR',
}

export interface LoggingServiceContext {
    logActivityStarted(text: string): string;

    logActivityEnded(id: string, error?: Error): void;

    log(message: string, level: LogLevel): void;
}

let loggingContext: LoggingServiceContext | undefined;

export const setLoggingServiceContext = (context: LoggingServiceContext) =>
    (loggingContext = context);

const substitute = (input: string, variables: RegExpMatchArray | null, args: any[]): string => {
    if (!variables) {
        return input;
    }

    let result = input;
    for (const variable of variables) {
        const idx = parseInt(variable.substring(2, variable.length - 1));
        result = result.replace(variable, args[idx]);
    }

    return result;
};

export function logActivity(description: string) {
    const variables: RegExpMatchArray | null = description.match(/#{([0-9]+)}/g);

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Set the loading frame text
            const substitutedDescription = substitute(description, variables, args);
            const activityId = loggingContext!.logActivityStarted(substitutedDescription);

            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult
                    .then((...args: any[]) => {
                        loggingContext!.logActivityEnded(activityId);

                        return args;
                    })
                    .catch((error) => {
                        loggingContext!.logActivityEnded(activityId, error);
                        throw error;
                    });

                return promisifiedResult;
            } catch (error) {
                loggingContext!.logActivityEnded(activityId, error);
                throw error;
            }
        };

        return descriptor;
    };
}

export const log = (message: string) => {
    loggingContext!.log(message, LogLevel.INFO);
};

export const logError = (message: string) => {
    loggingContext!.log(message, LogLevel.ERROR);
};

export const logDebug = (message: string) => {
    loggingContext!.log(message, LogLevel.DEBUG);
};
