import * as fs from 'fs';
import * as util from 'util';
import * as childProcess from 'child_process';
import {PathLike} from "fs";

export interface PromisifiedFs {
    readFile: (path: PathLike | number, options: { encoding?: string | null; flag?: string; } | string | undefined | null) => Promise<string>,
    writeFile: (arg1: (string | Buffer | URL | number), arg2: any) => Promise<unknown>
}

export abstract class ExecutionContext {
    readonly childProcess: typeof childProcess;
    readonly fs: typeof fs;
    readonly util: typeof util;
    readonly promisifiedFs: PromisifiedFs;

    protected constructor(){
        this.childProcess = require('child_process');
        this.fs = require('fs');
        this.util = require('util');

        this.promisifiedFs = {
            readFile: this.util.promisify(this.fs.readFile),
            writeFile: this.util.promisify(this.fs.writeFile)
        }
    }
}
