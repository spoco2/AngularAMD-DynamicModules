define(['app'], function (app) {
  console.log("homeCtrl Define")
  return app.controller('homeCtrl',['$scope', function($scope){
      console.log("homeCtrl Run");
  }]);
});