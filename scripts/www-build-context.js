"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const packageVersion = fse.readJsonSync("./package.json").version;
exports.buildContext = {
    timestamp: new Date().getTime()
};
{
    exports.buildContext.app = {
        id: "samar-park",
        packageId: "pl.samar.park",
        packageVersion: packageVersion,
        shortName: "PARK SAMAR",
        codePushAndroidProduction: "g9wli7PoQ4JSquJ30kFPl3mkfRsNEyJ_BY5xM",
        codePushAndroidStaging: "gW9HJnVCzqY9auYRX3MvkKT-p9UoEyJ_BY5xM",
        codePushIosProduction: "KmK8hQfHQDnUXbbm3uThKXJUE36tEyJ_BY5xM",
        codePushIosStaging: "LV1iSeyGKwSEOQsviUwIyq5O0QBPEyJ_BY5xM"
    };
}
// czy build produkcyjny czy dev. Nie możemy korzystać z ustawień
// IONIC, bo jeszcze skrypty ionic mogą nie być uruchomione
{
    exports.buildContext.production = process.env.IONIC_ENV == "prod" || process.argv.indexOf("--prod") > 0;
    exports.buildContext.development = !exports.buildContext.production;
}
// platforma, dla której kompilujemy www
{
    exports.buildContext.platform = {};
    exports.buildContext.platform.web = process.env.BUILD_PLATFORM == "web";
    exports.buildContext.platform.ios = process.env.BUILD_PLATFORM == "ios";
    exports.buildContext.platform.android = process.env.BUILD_PLATFORM == "android";
    exports.buildContext.platform.mobile = exports.buildContext.platform.ios || exports.buildContext.platform.android || !exports.buildContext.platform.web;
}    
console.log("buildContext: \"" + JSON.stringify(exports.buildContext));

exports.default = exports.buildContext;
