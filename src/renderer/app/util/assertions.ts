import { AssertionError } from '@/renderer/app/model/errors';

export const assertDefined = <T>(entityReference: string, arr: T[] | null | undefined) => {
    if (!arr) {
        throw new AssertionError(`Array is not defined: ${entityReference}`);
    }
};

export const assertArraySize = <T>(
    entityReference: string,
    arr: Array<T> | null | undefined,
    size: number,
) => {
    assertDefined(entityReference, arr);
    if (arr!.length !== size) {
        throw new AssertionError(
            `Could not assert array '${arr!.toString()}' is of size '${size}': ${entityReference}`,
        );
    }
};
