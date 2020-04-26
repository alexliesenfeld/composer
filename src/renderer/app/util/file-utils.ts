import * as request from "request";
import * as AdmZip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import {Fsx} from "@/renderer/app/util/fsx";

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
    if (await Fsx.exists(dirPath)) {
        const dirContents = await Fsx.readdir(dirPath);
        for (const file of dirContents) {
            const curPath = path.join(dirPath, file);
            // We need this for files that have been created with write protection.
            await addFilePermissions(curPath, 0o666);
            if ((await Fsx.lstat(curPath)).isDirectory()) { // recurse
                await deleteDirectory(curPath);
            } else { // delete file
                await Fsx.unlink(curPath);
            }
        }
        await Fsx.rmdir(dirPath);
    }
};

async function addFilePermissions(filePath: string, mode: number) {
    await Fsx.chmod(filePath, (await Fsx.stat(filePath)).mode | mode);
}

export const deleteFileIfExists = async (filePath: string) => {
    if (await Fsx.exists(filePath)) {
        await Fsx.unlink(filePath);
    }
};

export const moveDirContents = async (fromDir: string, toDir: string) => {
    const files = await Fsx.readdir(fromDir);
    await createDirIfNotExists(toDir);

    for (const fileName of files) {
        const fromFile = path.join(fromDir, fileName);
        const toFile = path.join(toDir, fileName);
        await Fsx.move(fromFile, toFile);
    }
};

export const moveDir = async (fromPath: string, toPath: string) => {
    await Fsx.move(fromPath, toPath);
};

export const ensureDirExists = async (dirPath: string): Promise<string> => {
    if (!await Fsx.exists(dirPath)) {
        await Fsx.mkdir(dirPath, {recursive: true})
    }
    return dirPath;
};

export const recreateDir = async (dependenciesDirectory: string): Promise<string> => {
    if (await Fsx.exists(dependenciesDirectory)) {
        await deleteDirectory(dependenciesDirectory)
    }
    await Fsx.mkdir(dependenciesDirectory);
    return dependenciesDirectory;
};

export const createDirIfNotExists = async (dirPath: string): Promise<void> => {
    if (!await Fsx.exists(dirPath)) {
        await Fsx.mkdir(dirPath);
    }
};


export const directoryIsEmpty = async (dirPath: string, fileNamesToIgnore?: string[]): Promise<boolean> => {
    const files = await Fsx.readdir(dirPath);

    if (files.length == 0) {
        return true;
    }

    if (!fileNamesToIgnore) {
        return false;
    }

    if (files.length > fileNamesToIgnore.length) {
        return false;
    }

    for (const file of files) {
        if (!fileNamesToIgnore.includes(file)) {
            return false;
        }
    }

    return true;
};

export const directoryDoesNotExistOrIsEmpty = async (dirPath: string, fileNamesToIgnore?: string[]): Promise<boolean> => {
    return !await Fsx.exists(dirPath) || await directoryIsEmpty(dirPath, fileNamesToIgnore);
};

export const copyFile = async (sourceFile: string, targetPath: string) => {
  await Fsx.copyFile(sourceFile, targetPath);
};
