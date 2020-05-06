import { Cpx } from '@/renderer/app/util/cpx';

const runGitCommand = async (command: string): Promise<string> => {
    return Cpx.spawn(command);
};

export const cloneRepo = async (url: string, sha1: string, targetDir: string): Promise<void> => {
    await runGitCommand(`git clone https://github.com/steinbergmedia/vst3sdk.git ${targetDir}`);
    await runGitCommand(`git -C ${targetDir} checkout ${sha1}`);
};

export const initSubmodule = async (submodule: string, targetDir: string): Promise<void> => {
    await runGitCommand(`git -C ${targetDir} submodule update --init ${submodule}`);
};
