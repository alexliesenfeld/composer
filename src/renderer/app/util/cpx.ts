import { CommandFailedError, OperationFailedError } from '@/renderer/app/model/errors';
import * as childProcess from 'child_process';
import * as sudo from 'sudo-prompt';

const spawn = (cmd: string, args: string[], cwd?: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const cp = childProcess.spawn(cmd, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: cwd,
        });

        let output = '';
        let errorOutput = '';

        cp.stdout!.on('data', function (chunk) {
            output += chunk;
        });

        cp.stderr!.on('data', function (chunk) {
            errorOutput += chunk;
        });

        cp.on('exit', function (code) {
            if (code != 0) {
                reject(new CommandFailedError(cmd, args, output, errorOutput, code));
            } else {
                resolve(output);
            }
        });
    });
};

const sudoExec = (cmd: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sudo.exec(cmd, { name: 'Composer' }, function (
            error: Error | undefined,
            stdout: string | Buffer | undefined,
            stderr: string | Buffer | undefined,
        ) {
            if (error) {
                reject(error);
            } else if (stderr) {
                reject(new OperationFailedError(stderr.toString()));
            } else {
                resolve();
            }
        });
    });
};

export abstract class Cpx {
    public static readonly spawn = spawn;
    public static readonly sudoExec = sudoExec;
}
