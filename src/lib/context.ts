import * as fs from 'fs';
import * as util from 'util';
import * as childProcess from 'child_process';

export interface ExecutionContext {
    childProcess: typeof childProcess;
    fs: typeof fs;
    util: typeof util;
}
