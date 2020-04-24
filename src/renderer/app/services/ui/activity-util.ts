export interface LoadingScreenContext {
    showLoadingScreen(loadingText: string): void;
    hideLoadingScreen(): void;
    pushEvent(text: string): void;
}

let context: LoadingScreenContext | undefined;

export const setLoadingScreenContext = (activityContext: LoadingScreenContext) => context = activityContext;

export function withLoadingScreen(description: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Set the loading frame text
            context!.showLoadingScreen(description);

            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult.finally(() => {
                    context!.hideLoadingScreen()
                });

                return promisifiedResult;
            } catch (error) {
                context!.hideLoadingScreen();
                throw error;
            }
        };

        return descriptor;
    }
}

export function activity(description: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Set the loading frame text
            context!.pushEvent(`Started: ${description}`);

            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult.finally(() => {
                    context!.pushEvent(`Completed: ${description}`);
                });

                return promisifiedResult;
            } catch (error) {
                context!.pushEvent(`Completed with error: ${description}. Error: ${error}`);
                throw error;
            }
        };

        return descriptor;
    }
}

