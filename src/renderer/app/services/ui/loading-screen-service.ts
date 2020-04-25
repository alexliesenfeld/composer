export interface LoadingServiceContext {
    showLoadingScreen(loadingText?: string): void;
    hideLoadingScreen(): void;
}

let loadingScreenContext: LoadingServiceContext | undefined;

export const setLoadingServiceContext = (context: LoadingServiceContext) => loadingScreenContext = context;

export function withLoadingScreen(description: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Set the loading frame text
            loadingScreenContext!.showLoadingScreen(description);

            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult.finally(() => {
                    loadingScreenContext!.hideLoadingScreen()
                });

                return promisifiedResult;
            } catch (error) {
                loadingScreenContext!.hideLoadingScreen();
                throw error;
            }
        };

        return descriptor;
    }
}

