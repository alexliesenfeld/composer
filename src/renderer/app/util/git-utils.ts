import {Cpx} from "@/renderer/app/util/cpx";

export const cloneRepo = async (url: string, sha1: string, targetDir: string) => {
    await runGitCommand(`git clone https://github.com/steinbergmedia/vst3sdk.git ${targetDir}`);
    await runGitCommand(`git -C ${targetDir} checkout ${sha1}`);
};

export const initSubmodule = async (submodule: string, targetDir: string) => {
    await runGitCommand(`git -C ${targetDir} submodule update --init ${submodule}`);
};

const runGitCommand = async (command: string): Promise<string> =>  {
    return Cpx.spawn(command);
};
