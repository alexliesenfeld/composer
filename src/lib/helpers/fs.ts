import * as fs from "fs";
import * as util from "util";

/**
 * Contains promisified functions from the node "fs" package.
 */
export abstract class Fs {
    static readonly readFile = util.promisify(fs.readFile);
    static readonly writeFile = util.promisify(fs.writeFile);
    static readonly readdir = util.promisify(fs.readdir);
    static readonly mkdir = util.promisify(fs.mkdir);
    static readonly exists = util.promisify(fs.exists);
    static readonly unlink = util.promisify(fs.unlink); // Asynchronously removes a file or symbolic link.
    static readonly lstat = util.promisify(fs.lstat);
    static readonly rmdir = util.promisify(fs.rmdir);
    static readonly rename = util.promisify(fs.rename);
}

