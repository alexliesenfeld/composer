import {Position, Toaster} from "@blueprintjs/core";
import {CustomError} from "@/renderer/app/model/errors";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";

const toaster = Toaster.create({
    position: Position.TOP,
    maxToasts: 3
});

const getMessageFor = (error: any) => {
    if (error instanceof CustomError) {
        return error.message;
    }
    return `An unexpected error occurred: ${error}`;
};

export function withErrorToast(description: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult.catch((error) => {
                    showErrorToast(description, error);
                    throw error;
                });

                return promisifiedResult;
            } catch (error) {
                showErrorToast(description, error);
                throw error;
            }
        };

        return descriptor;
    }
}

export function showErrorToast(description: string, error: Error) {
    toaster.show({
        message: `${description}: ${getMessageFor(error)}`,
        icon: "warning-sign",
        intent: Intent.DANGER,
        timeout: 30000
    });
}

export function showSuccessToast(message: string) {
    toaster.show({
        message: `${message}${message.endsWith('.') ? '' : '.'}`,
        icon: "tick-circle",
        intent: Intent.SUCCESS,
        timeout: 2000,
    });
}
