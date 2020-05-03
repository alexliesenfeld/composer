import * as fs from "fs";
import * as util from "util";
import * as mv from "mv";


/**
 * Contains promisified functions from the node "fs" package.
 */
export abstract class Fsx {
    static readonly readFile = util.promisify(fs.readFile);
    static readonly writeFile = util.promisify(fs.writeFile);
    static readonly readdir = util.promisify(fs.readdir);
    static readonly mkdir = util.promisify(fs.mkdir);
    static readonly exists = util.promisify(fs.exists);
    static readonly unlink = util.promisify(fs.unlink); // Asynchronously removes a file or symbolic link.
    static readonly lstat = util.promisify(fs.lstat);
    static readonly stat = util.promisify(fs.stat);
    static readonly chmod = util.promisify(fs.chmod);
    static readonly rmdir = util.promisify(fs.rmdir);
    static readonly rename = util.promisify(fs.rename);
    static readonly move = (util.promisify(mv));
    static readonly copyFile = util.promisify(fs.copyFile);
    static readonly link = util.promisify(fs.link);
    static readonly symlink = util.promisify(fs.symlink);
}
