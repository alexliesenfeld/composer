import { AssertionError } from '@/renderer/app/model/errors';

export const removeSpaces = (value: string) => value.replace(' ', '');
export const matchesVersion = (value: string) => !!value.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g);

export const replace = (content: string, from: string, to: string): { success: boolean; newContent: string } => {
    const replacedFileContent = content.replace(from, to);

    return {
        success: !!replacedFileContent && replacedFileContent !== content,
        newContent: replacedFileContent,
    };
};

export const assertReplace = (content: string, from: string, to: string): string => {
    const { newContent, success } = replace(content, from, to);
    if (!success) {
        throw new AssertionError(`Could not replace string '${from}' to '${to}'.`);
    }

    return newContent;
};

export const replaceAll = (content: string, from: string, to: string): string => {
    return content.split(from).join(to);
};

export const times = (text: string, repeatTimes: number): string => {
    let content = '';
    for (let i = 0; i < repeatTimes; i++) {
        content += text;
    }

    return content;
};

export const loremIpsum = `Once upon a time, a very long time ago now, about last Friday, Winnie-the-Pooh lived in a forest all by himself under the name of Sanders. ("What does 'under the name' mean?" asked Christopher Robin. "It means he had the name over the door in gold letters, and lived under it." "Winnie-the-Pooh wasn't quite sure," said Christopher Robin. "Now I am," said a growly voice. "Then I will go on," said I.) One day when he was out walking, he came to an open place in the middle of the forest, and in the middle of this place was a large oak-tree, and, from the top of the tree, there came a loud buzzing-noise. Winnie-the-Pooh sat down at the foot of the tree, put his head between his paws and began to think. First of all he said to himself: "That buzzing-noise means something. You don't get a buzzing-noise like that, just buzzing and buzzing, without its meaning something. If there's a buzzing-noise, somebody's making a buzzing-noise, and the only reason for making a buzzing-noise that I know of is because you're a bee." Then he thought another long time, and said: "And the only reason for being a bee that I know of is making honey." And then he got up, and said: "And the only reason for making honey is so as I can eat it." So he began to climb the tree. He climbed and he climbed and he climbed, and as he climbed he sang a little song to himself. It went like this: Isn't is funny how a bear likes honey? Buzz! Buzz! Buzz! I wonder why he does?`;
