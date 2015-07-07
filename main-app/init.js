console.log("=-=-=-= init.js Start =-=-=-=");
require.config({
    baseUrl: "",

    // Paths for just the core application and its controllers/factories/services
    // ALL Components under /programs should be loaded dynamically at runtime
    paths: {
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.1/angular.min",
        "angular-ui-router": "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min",
        "angularAMD": "//cdn.jsdelivr.net/angular.amd/0.2/angularAMD.min",
        "app": "main-app/app",
        "templateStorage":"main-app/modules/templates"
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        //Tell requirejs to pipe in angular's return variable as "angular"
        "angular": {exports: "angular"},
        "angularAMD": ["angular"],
        "angular-ui-router": ["angular"]
    },

    // kick start application, and include all app level requirements
    deps: ["app"]
});