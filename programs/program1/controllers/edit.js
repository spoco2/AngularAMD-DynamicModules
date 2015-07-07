define(["../module"], function (program1_module) {
    console.log("Program 1 Edit ",program1_module);
    var edit = program1_module.controller('program1EditCtrl',['$scope',function($scope) {
        console.log("Program 1 Edit Controller");
    }]);
    return edit;
});