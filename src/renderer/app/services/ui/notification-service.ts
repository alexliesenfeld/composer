import { logError } from '@/renderer/app/services/ui/logging-service';
import { Intent, Position, Toaster } from '@blueprintjs/core';

export interface NotificationServiceContext {
    showLog(): void;
}

let notificationContext: NotificationServiceContext | undefined;
export const setNotificationServiceContext = (context: NotificationServiceContext) =>
    (notificationContext = context);

const toaster = Toaster.create({
    position: Position.TOP,
    maxToasts: 1,
});

export function showErrorNotification(message: string, error: Error, withLogOnError?: boolean) {
    const errorMessage = `${message}. Error: ${error.message}`;
    logError(errorMessage);
    toaster.show({
        message: errorMessage,
        icon: 'warning-sign',
        intent: Intent.DANGER,
        action: withLogOnError
            ? {
                  onClick: () => notificationContext!.showLog(),
                  text: 'Show Log',
              }
            : undefined,
        timeout: 10000,
    });
}

export function showSuccessNotification(message: string) {
    toaster.show({
        message: `${message}${message.endsWith('.') ? '' : '.'}`,
        icon: 'tick-circle',
        intent: Intent.SUCCESS,
        timeout: 1000,
    });
}

export function showWarningNotification(message: string) {
    toaster.show({
        message: `${message}${message.endsWith('.') ? '' : '.'}`,
        icon: 'warning-sign',
        intent: Intent.WARNING,
        timeout: 3000,
    });
}

export interface WithNotificationOptions {
    onError?: string;
    onSuccess?: string;
    showLogButton?: boolean;
}

export function withNotification(options: WithNotificationOptions) {
    return function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        descriptor.value = function (...args: any[]) {
            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // Show a message if the promise resolves successfully
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                promisifiedResult.then((...args: any[]) => {
                    if (options.onSuccess) {
                        showSuccessNotification(options.onSuccess);
                    }

                    return args;
                });

                // Show an error message if the promise is rejected with an error
                promisifiedResult.catch((error) => {
                    if (options.onError) {
                        showErrorNotification(options.onError, error, options.showLogButton);
                    }
                    throw error;
                });

                return promisifiedResult;
            } catch (error) {
                if (options.onError) {
                    showErrorNotification(options.onError, error, options.showLogButton);
                }
                throw error;
            }
        };

        return descriptor;
    };
}
