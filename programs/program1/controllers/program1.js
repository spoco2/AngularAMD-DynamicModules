define(["../module"], function (program1_module) {
    console.log("Program 1 START? ",program1_module);
    var program1 = program1_module.controller('program1Ctrl',['$scope','$rootScope',function($scope) {
        console.log("Program 1 Controller");
    }]);
    return program1;
});