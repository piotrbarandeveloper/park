#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const glob = require("glob");
const path = require("path");
const www_build_context_1 = require("./www-build-context");
const preprocessor_1 = require("./preprocessor");
// usuwamy katalog .src, aby usunąć potencjalnie nieistniejące pliki
// kopiujemy cała zawartosc src do .src
fse.removeSync("./.src/");
fse.ensureDirSync("./.src/");
fse.copySync("./src", "./.src/");
// musimy utworzyć tymczasowy
// tsconfig, aby kompilować to co jest w .src
{
    var tsconfig = JSON.parse(fse.readFileSync("tsconfig.json").toString());
    tsconfig.compilerOptions.outDir = undefined;
    for (let i = 0; i < tsconfig.include.length; i++) {
        if (tsconfig.include[i].indexOf("src/") === 0) {
            tsconfig.include[i] = ".src/" + tsconfig.include[i].substr(4);
        }
    }
    for (let i in tsconfig.compilerOptions.paths) {
        for (var x = 0; x < tsconfig.compilerOptions.paths[i].length; x++) {
            tsconfig.compilerOptions.paths[i][x] = tsconfig.compilerOptions.paths[i][x].replace("src", ".src");
        }
    }
    fse.writeFileSync("tsconfig.build.json", JSON.stringify(tsconfig));
}
// uruchamiamy preprocessor dla plikow ts, scss, html
{
    glob.sync("/**/*.ts", { root: path.join(process.cwd(), ".src") }).forEach(function (file) {
        preprocessor_1.processFile(file);
    });
    glob.sync("/**/*.scss", { root: path.join(process.cwd(), ".src") }).forEach(function (file) {
        preprocessor_1.processFile(file);
    });
    glob.sync("/**/*.html", { root: path.join(process.cwd(), ".src") }).forEach(function (file) {
        preprocessor_1.processFile(file);
    });
}
