const fs = require('fs');
const path = require('path');

class Build {
    constructor() {
        this.copyOperator = null;
        this.path = path.dirname(path.dirname(path.dirname(__dirname)));
    }
    build(buildPath, name) {
        if (!name) {
            throw new Error("未指定项目名称");
        }
        this.copyOperator = new CopyOperator(name);
        this.copyOperator.copy(path.dirname(__dirname) + '/lib/template', (buildPath || this.path) + '/' + name);
    }
}

class CopyOperator {
    constructor(name) {
        this.stat = fs.statSync;
        this.name = name;
    }
    readDir(basePath, encoding) {
        return fs.readdirSync(basePath, {encoding: encoding || 'utf8'});
    }

    copy(basePath, destPath, encoding) {
        let dirs = this.readDir(basePath, encoding);
        for (let file of dirs) {
            if (file === '.git') {
                return ;
            }
            if (this.stat(basePath + '/' + file).isDirectory() && file !== 'okgoes') {
                this.copy(basePath + '/' + file, destPath + '/' + file);
            }
            if (this.stat(basePath + '/' + file).isFile()) {
                if (!fs.existsSync(destPath)) {
                    CopyOperator.mkdir(destPath);
                }
                if (fs.existsSync(basePath + '/' + file)) {
                    fs.copyFileSync(basePath + '/' + file, destPath + '/' + file);
                    console.log('create ' + destPath + '/' + file + ' success');
                    if (file === 'package.json') {
                        fs.writeFileSync(destPath + '/' + file, fs.readFileSync(destPath + '/' + file).toString().replace('$name', this.name));
                    }
                }
            }
        }
    }
}
CopyOperator.mkdir = (filePath) => {
    if (fs.existsSync(filePath)) {
        return true;
    }
    if (!fs.existsSync(path.dirname(filePath))) {
        CopyOperator.mkdir(path.dirname(filePath));
    }
    fs.mkdirSync(filePath);
}
module.exports = Build;