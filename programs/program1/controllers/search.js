define(["../module"], function (program1_module) {
    console.log("Program 1 Search ",program1_module);
    var search = program1_module.controller('program1SearchCtrl',['$scope',function($scope) {
        console.log("Program 1 Search Controller");
    }]);
    return search;
});