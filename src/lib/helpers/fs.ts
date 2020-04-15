import * as fs from "fs";
import * as util from "util";

/**
 * Contains promisified functions from the node "fs" package.
 */
export abstract class Fs {
    static readonly readFile = util.promisify(fs.readFile);
    static readonly writeFile = util.promisify(fs.writeFile);
    static readonly readdir = util.promisify(fs.readdir);
}

