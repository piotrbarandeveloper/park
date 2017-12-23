"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const preprocess = require("preprocess");
const www_build_context_1 = require("./www-build-context");
function processFile(filePath, outPath) {
    if (!outPath) {
        outPath = filePath;
    }
    let options = {
        type: path.extname(filePath).substring(1),
        srcDir: path.dirname(filePath)
    };
    preprocess.preprocessFileSync(filePath, outPath || filePath, www_build_context_1.default, options);
}
exports.processFile = processFile;
