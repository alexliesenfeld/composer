import {Position, Toaster} from "@blueprintjs/core";
import {CustomError} from "@/lib/model/errors";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";

const toaster = Toaster.create({
    position: Position.TOP,
    maxToasts: 3
});

export const toasted = (fn: ((...args: any[]) => Promise<any | void | unknown>)[]) => {
    return fn.map((f) => {
        return (...args: any[]): void => {
            f(...args).catch((error) => {
                toaster.show({message: getMessageFor(error),  icon: "warning-sign",  intent: Intent.DANGER});
                throw error;
            });
        }
    });
};

const getMessageFor = (error: any) => {
    if (error instanceof CustomError) {
        return error.message;
    }
    return `An unexpected error occurred: ${error}`;
};
