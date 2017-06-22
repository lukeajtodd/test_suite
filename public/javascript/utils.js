var fs = require('fs');
var path = require('path');
function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            }
            else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}
;
function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                mkdirSync(dir);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                })["catch"](reject);
            });
        });
    });
}
;
var mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath);
    }
    catch (err) {
        if (err.code !== 'EEXIST')
            throw err;
    }
};
module.exports = {
    rmdir: deleteDirectory,
    rmfile: deleteFile,
    mkdir: mkdirSync
};

//# sourceMappingURL=sourcemaps/utils.js.map
