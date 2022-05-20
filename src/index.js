import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import config from '../config.js';

function mapFiles(filesPath) {
    const basePath = filesPath && filesPath !== '' ? filesPath : cwd();
    const directory = path.normalize(basePath);
    const files = fs.readdirSync(directory);
    const mappedFiles = {};
    for (const file of files) {
        if (file.match('^.*.lua')) {
            const buffer = fs.readFileSync(path.join(directory, file));
            mappedFiles[file] = buffer.toString('utf-8');
        }
    }
    return mappedFiles;
}

function ensureDirectoryExists(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
}

function filterByPriority(priorities, skipList, files) {
    const filteredFiles = {};
    for (const priority of priorities) {
        const content = files[priority];
        if (content) {
            filteredFiles[priority] = content;
            delete files[priority];
        }
    }
    Object.assign(filteredFiles, { ...files });
    skipList.forEach((filename) => {
        delete filteredFiles[filename];
    });
    return filteredFiles;
}

function bundle(savePath, files) {
    savePath = savePath && savePath !== '' ? savePath : cwd();
    let bundledContent = "-- Bundled with https://github.com/https-eduardo/lua-bundler";
    for (const file in files) {
        const content = files[file];
        bundledContent += `\n${content}`;
    }
    ensureDirectoryExists(savePath);
    fs.writeFileSync(savePath, bundledContent, { flag: 'w+' });
    console.log("✔ Files bundled sucessfully. Thanks for using. <3");
}

const mappedFiles = mapFiles(config.path);
const filteredFiles = filterByPriority(config.priorities, config.skip, mappedFiles);
bundle(config.save.path, filteredFiles);
