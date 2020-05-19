import { Cpx } from '@/renderer/app/util/cpx';

const runGit = async (args: string[]): Promise<string> => {
    return Cpx.spawn('git', args);
};

export const cloneRepo = async (url: string, sha1: string, targetDir: string): Promise<void> => {
    await runGit(['clone', url, targetDir]);
    await runGit(['-C', targetDir, 'checkout', sha1]);
};

export const initSubmodule = async (submodule: string, targetDir: string): Promise<void> => {
    await runGit(['-C', targetDir, 'submodule', 'update', '--init', submodule]);
};
