import * as request from "request";
import * as AdmZip from "adm-zip";

const fs = require('fs');

export const downloadFile = (url: string, target: string) => {
    return new Promise(function (resolve, reject) {
        request.get(url).pipe(fs.createWriteStream(target))
            .on('finish', resolve)
            .on('error', reject)
    });
};

export const unzipFile = async (zipFilePath: string, targetDir: string) => {
    const zip = new AdmZip(zipFilePath);

    return new Promise(function (resolve, reject) {
        zip.extractAllToAsync(targetDir, true, (err: Error) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });

};

export const deleteFolderRecursive = (path: string) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file: string) => {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
