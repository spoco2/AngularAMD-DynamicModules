define(['app'], function (app) {
  console.log("appCtrl Define")
  return app.controller('appCtrl',['$scope', function($scope){
      console.log("appCtrl Run");
  }]);
});