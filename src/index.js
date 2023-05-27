import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import config from '../config.js';

function mapFiles(filesPath) {
    const basePath = filesPath && filesPath !== '' ? filesPath : cwd();
    const directory = path.normalize(basePath);
    const fileNames = fs.readdirSync(directory);

    const mappedFiles = {};

    for (const fileName of fileNames) {
        if (fileName.match('^.*.lua')) {
            const buffer = fs.readFileSync(path.join(directory, fileName));
            mappedFiles[fileName] = buffer.toString('utf-8');
        }
    }

    return mappedFiles;
}

function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) 
        return true;

    fs.mkdirSync(dirname);
}

function filterByPriority(priorities, originalFiles) {
    // Clone files into a new object
    const files = { ...originalFiles };

    const filteredFiles = {};

    for (const priority of priorities) {
        const content = files[priority];
        if (content) {
            filteredFiles[priority] = content;
            delete files[priority];
        }
    }
    Object.assign(filteredFiles, { ...files });

    return filteredFiles;
}

function filterBySkipList(skipList, files) {
    // Clone files into a new object
    const filteredFiles = {...files};

    // Remove files that will be skipped from the array
    for (const skipFile of skipList) {
        if (filteredFiles[skipFile])
            delete filteredFiles[skipFile];
    }
    return filteredFiles;
}

function bundle(path, files) {
    const savePath = path && path !== '' ? path : cwd();
    let bundledContent = "-- Bundled with https://github.com/https-eduardo/lua-bundler";
    for (const file in files) {
        const content = files[file];
        bundledContent += `\n${content}`;
    }
    ensureDirectoryExists(savePath);
    fs.writeFileSync(savePath, bundledContent, { flag: 'w+' });
    console.log("✔ Files bundled sucessfully. Thanks for using. <3");
}

// Map files into objects
let files = mapFiles(config.path);

// Filter files by priority and skip list
files = filterBySkipList(config.skip, files);
files = filterByPriority(config.priorities, files);

bundle(config.save.path, files);
