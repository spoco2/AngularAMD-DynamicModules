define(["../module"], function (program1_module) {
    console.log("Program 1 START? ",program1_module);
    var program1 = program1_module.controller('program1Ctrl',['$scope','$state',function($scope,$state) {
        console.log("Program 1 Controller");
		   //Bit hacky, but it'll do. If the search state exists, then navigate to it.
        if($state.get("app.program1.search")) {
            console.log("GO SEARCH!!!");
            $state.go("app.program1.search");
        }
		
    }]);
    return program1;
});