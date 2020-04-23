import * as request from "request";
import * as AdmZip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import {Fs} from "@/renderer/app/util/fs";

export const downloadFile = (url: string, target: string) => {
    return new Promise(function (resolve, reject) {
        request.get(url)
            .pipe(fs.createWriteStream(target))
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

export const deleteDirectory = async (dirPath: string) => {
    if (await Fs.exists(dirPath)) {
        const dirContents = await Fs.readdir(dirPath);
        for (const file of dirContents) {
            const curPath = path.join(dirPath, file);
            if ((await Fs.lstat(curPath)).isDirectory()) { // recurse
                await deleteDirectory(curPath);
            } else { // delete file
                await Fs.unlink(curPath);
            }
        }
        await Fs.rmdir(dirPath);
    }
};

export const deleteFileIfExists = async (filePath: string) => {
    if (await Fs.exists(filePath)) {
        await Fs.unlink(filePath);
    }
};

export const moveDirContents = async (fromDir: string, toDir: string) => {
    const files = await Fs.readdir(fromDir);
    await createDirIfNotExists(toDir);

    for (const fileName of files) {
        const fromFile = path.join(fromDir, fileName);
        const toFile = path.join(toDir, fileName);
        await Fs.move(fromFile, toFile);
    }
};

export const moveDir = async (fromPath: string, toPath: string) => {
    await Fs.move(fromPath, toPath);
};

export const ensureDirExists = async (dirPath: string): Promise<string> => {
    if (!await Fs.exists(dirPath)) {
        await Fs.mkdir(dirPath, {recursive: true})
    }
    return dirPath;
};

export const recreateDir = async (dependenciesDirectory: string): Promise<string> => {
    if (await Fs.exists(dependenciesDirectory)) {
        await deleteDirectory(dependenciesDirectory)
    }
    await Fs.mkdir(dependenciesDirectory);
    return dependenciesDirectory;
};

export const createDirIfNotExists = async (dirPath: string): Promise<void> => {
    if (!await Fs.exists(dirPath)) {
        await Fs.mkdir(dirPath);
    }
};
