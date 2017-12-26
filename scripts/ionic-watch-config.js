"use strict";
const fse = require("fs-extra");
const path = require("path");
const logger = require("@ionic/app-scripts/dist/logger/logger").Logger;
const preprocessor_1 = require("./preprocessor");
const mirrorPath = path.resolve("./.src");
const srcPath = path.resolve("./src");
function mirrorAndPreprocess(event, filePath, context) {
    return new Promise((resolve, reject) => {
        let extension = path.extname(filePath);
        let newPath = mirrorPath + filePath.substring(srcPath.length);
        if (event == "add" || event == "change") {
            fse.ensureDirSync(path.dirname(newPath));
            if (extension == ".ts" || extension == ".js" || extension == ".css" || extension == ".html" || extension == ".scss") {
                preprocessor_1.processFile(filePath, newPath);
            }
            else {
                fse.copySync(filePath, newPath);
            }
            logger.debug("src mirror/preprocess, file add/change: " + filePath.substring(srcPath.length));
        }
        else if (event == "unlink" || event == "unlinkDir") {
            fse.removeSync(newPath);
            logger.debug("src mirror/preprocess, file removed: " + filePath.substring(srcPath.length));
        }
        resolve("src mirror/preprocess, file: " + filePath);
    });
}
const config = require("@ionic/app-scripts/config/watch.config");
config.srcFiles.paths.push("{{ROOT}}/node_modules/**/*.(ts|js|html|s(c|a)ss)");
config.mirrorSrc = {
    paths: ["src/**/*"],
    callback: mirrorAndPreprocess
};
module.exports = config;
