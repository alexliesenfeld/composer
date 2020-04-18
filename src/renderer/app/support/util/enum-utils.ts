export function enumEntries<T>(t: T): ReadonlyArray<readonly [keyof T, T[keyof T]]> {
    const entries = Object.entries(t);
    const plainStringEnum = entries.every(
        ([key, value]) => typeof value === 'string'
    );
    return (plainStringEnum
        ? entries
        : entries.filter(([k, v]) => typeof v !== 'string')) as any;
}

export function enumKeys<T>(t: T): ReadonlyArray<keyof T> {
    return enumEntries(t).map(([key]) => key);
}

export function enumValues<T>(t: T): ReadonlyArray<T[keyof T]> {
    const values = Object.values(t);
    const plainStringEnum = values.every(x => typeof x === 'string');
    return plainStringEnum ? values : values.filter(x => typeof x !== 'string');
}
