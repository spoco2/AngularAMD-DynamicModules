define(function(require) {
    var appCtrl = require("./app");
    var homeCtrl = require("./home");
    
    console.log("App/Controllers loaded");
    return {appCtrl:appCtrl,homeCtrl:homeCtrl};
});
