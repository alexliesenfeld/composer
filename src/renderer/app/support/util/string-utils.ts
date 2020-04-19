export const removeSpaces = (value: string) => value.replace(' ', '');
export const matchesVersion = (value: string) => !!value.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g);
