import * as child_process from "child_process";
import {CommandFailedError, OperationFailedError} from "@/renderer/app/model/errors";

const sudo = require('sudo-prompt');

const spawn = (cmd: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const parts = cmd.split(/\s+/g);
        const cp = child_process.spawn(parts[0], parts.slice(1), {stdio: ['ignore', 'pipe', 'pipe']});

        let output = "";
        let errorOutput = "";

        cp.stdout!.on('data', function (chunk) {
            output += chunk;
        });

        cp.stderr!.on('data', function (chunk) {
            errorOutput += chunk;
        });

        cp.on('exit', function (code) {
            if (code != 0) {
                reject(new CommandFailedError(cmd, errorOutput, code))
            } else {
                resolve(output);
            }
        });
    });
};

const sudoExec = (cmd: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sudo.exec(cmd, {name: 'Composer'},
            function (error: any, stdout: any, stderr: any) {
                if (error) {
                    reject(error);
                } else if (stderr) {
                    reject(new OperationFailedError(stderr));
                } else {
                    resolve();
                }
            }
        );
    });
};

export abstract class Cpx {
    static readonly spawn = spawn;
    static readonly sudoExec = sudoExec;
}

