"use strict";
const path = require("path");
const config = require("@ionic/app-scripts/config/webpack.config");
config.prod.resolve.modules = config.dev.resolve.modules = [path.resolve(".src", "node_modules"), path.resolve("node_modules")];
config.prod.resolve.alias = config.dev.resolve.alias = { "@this": path.resolve(".src") };
module.exports = config;
