import * as request from "request";
import * as AdmZip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import {Fs} from "@/lib/helpers/fs";

export const downloadFile = (url: string, target: string) => {
    return new Promise(function (resolve, reject) {
        request.get(url).pipe(fs.createWriteStream(target))
            .on('finish', resolve)
            .on('error', reject)
    });
};

export const unzipFile = async (zipFilePath: string, targetDir: string) => {
    return new Promise((resolve, reject) => {
        const zip = new AdmZip(zipFilePath);
        zip.extractAllToAsync(targetDir, true, (err: Error) => err ? reject(err) : resolve())
    });
};

export const deleteFolderRecursive = async (dirPath: string) => {
    if (await Fs.exists(dirPath)) {
        const dirContents = await Fs.readdir(dirPath);
        for (const file of dirContents) {
            const curPath = path.join(dirPath, file);
            if ((await Fs.lstat(curPath)).isDirectory()) { // recurse
                await deleteFolderRecursive(curPath);
            } else { // delete file
                await Fs.unlink(curPath);
            }
        }
        await Fs.rmdir(dirPath);
    }
};
