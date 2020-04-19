import {Position, Toaster} from "@blueprintjs/core";
import {CustomError} from "@/lib/model/errors";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";

const toaster = Toaster.create({
    position: Position.TOP,
    maxToasts: 3
});

export type ToastableFunction = ((...args: any) => Promise<any | void | unknown>);
export type ToastedFunction = (...args: any[]) => void;

export const allToasted = (fn: ToastableFunction[]) => {
    return fn.map((f) => toasted(f));
};

export const toasted = (f: ToastableFunction) => {
    return (...args: any[]): void => {
        f(...args).catch((error) => {
            toaster.show({
                message: getMessageFor(error),
                icon: "warning-sign",
                intent: Intent.DANGER,
                timeout: 10000
            });
            throw error;
        });
    };
};

const getMessageFor = (error: any) => {
    if (error instanceof CustomError) {
        return error.message;
    }
    return `An unexpected error occurred: ${error}`;
};
