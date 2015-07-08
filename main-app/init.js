console.log("=-=-=-= init.js Start =-=-=-=");
require.config({
    baseUrl: "",

    // Paths for just the core application and its controllers/factories/services
    // ALL Components under /programs should be loaded dynamically at runtime
    paths: {
        "angular": "bower_components/angular/angular",
        "jquery": "bower_components/jquery/dist/jquery",
        "angular-ui-router": "bower_components/angular-ui-router/release/angular-ui-router",
        "angularAMD": "bower_components/angularAMD/angularAMD",
		"ngload": "bower_components/angularAMD/ngload",
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