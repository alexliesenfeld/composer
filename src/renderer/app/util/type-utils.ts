export function enumEntries<T>(t: T): ReadonlyArray<readonly [keyof T, T[keyof T]]> {
    const entries = Object.entries(t);
    const plainStringEnum = entries.every(([, value]) => typeof value === 'string');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (plainStringEnum ? entries : entries.filter(([, v]) => typeof v !== 'string')) as any;
}

export function enumKeys<T>(t: T): ReadonlyArray<keyof T> {
    return enumEntries(t).map(([key]) => key);
}

export function enumValues<T>(t: T): ReadonlyArray<T[keyof T]> {
    const values = Object.values(t);
    const plainStringEnum = values.every((x) => typeof x === 'string');

    return plainStringEnum ? values : values.filter((x) => typeof x !== 'string');
}

export function cheapUUID() {
    return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
}

export function arraysEqual<T>(a: T[], b: T[]) {
    if (a == b) {
        return true;
    }

    if (a.length != b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}
