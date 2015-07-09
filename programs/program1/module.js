define(["angularAMD","require"],function(angularAMD,require) {
    console.log("Program 1 Module");
    //First, create Module.
    var program1_module = angular.module("program1_module", ["angular-ui-router", "$state"]);

    //Now module is defined. Load controllers.
    require(["./controllers/main"],function(controllers){
        console.log("Program 1 Module: controllers loaded: ",controllers);
        program1_module.config(["$stateProvider", function ($stateProvider){
            console.log("Program 1 Module Config",$stateProvider);
                $stateProvider
                    .state('app.program1.search',{  //DON'T WANT FULL PATH HERE :(
                            authenticate: true,
                            url:"/search",
                            templateUrl:"programs/program1/templates/search.html",  //Would prefer these to be relative too... pass something down?
                            controller: "program1SearchCtrl"
                        })
                    .state('app.program1.edit',{
                        authenticate: true,
                        url:"/edit/{id}",
                        templateUrl:"programs/program1/templates/edit.html",
                        controller: "program1EditCtrl"
                    });
                   
            }]);
			
        program1_module.run(["$state", function($state){
			console.log("Program 1 Module: Go to search state");
			$state.go("app.program1.search");
		}]);			

		//MUST RUN THIS IN HERE! Has to be run within the resolve of the require so that the config
		//and run blocks have been defined before processQueue is called. If you call it outside of this return
		//function, they will not be defined.
		angularAMD.processQueue();
    });
		


    return program1_module;
});