import {AssertionError} from "@/renderer/app/model/errors";

export const removeSpaces = (value: string) => value.replace(' ', '');
export const matchesVersion = (value: string) => !!value.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g);


export const assertReplace = (content: string, from: string, to: string): string => {
    const replacedFileContent = content.replace(from, to);
    if (!replacedFileContent || replacedFileContent === content) {
        throw new AssertionError(`Could not replace string '${from}' to '${to}'in content ${content}.`)
    }
    return replacedFileContent;
};

export const replaceAll = (content: string, from: string, to: string): string => {
    return content.split(from).join(to);
};
