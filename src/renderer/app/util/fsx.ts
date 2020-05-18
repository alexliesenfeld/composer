import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as util from 'util';

/**
 * Contains promisified functions from the node "fs" package.
 */
export abstract class Fsx {
    public static readonly readFile = util.promisify(fs.readFile);
    public static readonly writeFile = util.promisify(fs.writeFile);
    public static readonly readdir = util.promisify(fs.readdir);
    public static readonly mkdir = util.promisify(fs.mkdir);
    public static readonly exists = util.promisify(fs.exists);
    public static readonly unlink = util.promisify(fs.unlink); // Asynchronously removes a file or symbolic link.
    public static readonly lstat = util.promisify(fs.lstat);
    public static readonly stat = util.promisify(fs.stat);
    public static readonly chmod = util.promisify(fs.chmod);
    public static readonly rmdir = util.promisify(fs.rmdir);
    public static readonly rename = util.promisify(fs.rename);
    public static readonly copyFile = util.promisify(fs.copyFile);
    public static readonly link = util.promisify(fs.link);
    public static readonly symlink = util.promisify(fs.symlink);
    public static readonly move = fsExtra.move;
    public static readonly copyDir = fsExtra.copy;
}
