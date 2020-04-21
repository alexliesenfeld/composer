export interface ActivityContext {
    push(actionDescription: string): string;

    pop(id: string): void;
}

let context: ActivityContext | undefined;

export function setActivityContext(activityContext: ActivityContext) {
    context = activityContext;
}


export function activityNew<T extends Promise<U>, U>(f: (...args: any[]) => T) {

}

export function activity(description: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Push the activity onto the execution context
            const activityId = context ? context.push(description) : undefined;

            // Execute the actual / original method
            try {
                const result = originalMethod.apply(this, args);
                // Promise.resolve creates a new promise object. If the value passed is itself a promise,
                // it is resolved or rejected when the original one is. If it is anything else,
                // the new promise is resolved immediately with that value.
                const promisifiedResult = Promise.resolve(result);

                // The description will be popped from the execution context once the promise resolves
                promisifiedResult.finally(() => {
                    if (activityId) {
                        context!.pop(activityId)
                    }
                });

                return promisifiedResult;
            } catch (e) {
                if (activityId) {
                    context!.pop(activityId)
                }
                throw e;
            }
        };

        return descriptor;
    }
}
