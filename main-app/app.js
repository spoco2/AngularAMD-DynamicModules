/**
 * The main application. This demonstation code has the run and config blocks with all code
 * defined here in the app. This isn't best practice, and is just messy. These would 
 * live out in providers, and will once I bed things down.
 * 
 */
define(["angularAMD","angular-ui-router","require","templateStorage","jquery"],function (angularAMD) {

    //1. Define the application
    var app = angular.module("app", ["ui.router","templateStorage"]);
    console.log("App Module: Created");
    
    //listing dependancy on controllers here. AFTER app is defined, as they require it
    //but Before defining the config, as that requires them to be available
    require(["./main-app/controllers/main"],function(includes){
        console.log("App Module: Sub Components loaded: ",includes);
        app.config(["$stateProvider", "$locationProvider","$urlRouterProvider", function ($stateProvider, $locationProvider,$urlRouterProvider) {
            console.log("App Module: Config Execute");

            console.log("App Module: Defer Routing");
            $urlRouterProvider.deferIntercept(); //Stop path resolution until we've loaded them all.

            //Set up persistant pointers to the state and urlRouter providers for dynamically adding things to them
            app._stateProvider = $stateProvider;
            app._urlRouterProvider = $urlRouterProvider;
            
            
            //Set up main app states.
            //DO NOT Use angularAMD.route here. By doing so we would need to point to the controller locations directly,
            //and this stops the optimizer pulling them into this single code. Plus we don't need to lazy load these parts of the app,
            //as they're the _core_ app anyway.
             $stateProvider
                .state('app',{
                    url: '/',
                    authenticate: true,
                    views:{
                        'appWrapper':{
                            templateUrl:"main-app/templates/header.html",
                            controller: "appCtrl"
                        },
                        'program':{
                            templateUrl:"main-app/templates/home.html",
                            controller:"homeCtrl"
                        }
                    }
                });
        }]);
      
       console.log("App Module: Config Defined");
    
       /**
       * Runtime config, load from config file. This could be done via call to backend also
       */
      app.run(["$http","$rootScope","$location","$urlRouter","$state", function($http,$rootScope,$location,$urlRouter,$state){
          console.log("App Module: Run Block 1 Execute");
          $http.get('main-app/config/validComponents.json').then(function (resp) {
              console.log("Config File Loaded");
              angular.forEach(resp.data, function (item) {
                  var prog = item.name;
                  var stateName =  "app."+prog;
                  //If the item being loaded is a state to switch to, set that up
                  //States are now loaded 'under' the app state, so we place them as 'app.statename'
                  //For states, we expect them to have a template and controller to display in the state
                  //THESE SHOULD USE ANGULARAMD.ROUTE
                  //These we want to load lazily, as they are the self contained 'programs'
                  if(item.isState) {
                    
                      var state =  {
                          url:  prog,  
                          authenticate: item.authenticate,
                          views: {
                              "program@":angularAMD.route({
                                  templateUrl: "programs/" + prog + "/templates/" + prog + ".html", //This will end up in template cache, so url is ok
                                  controllerUrl: "programs/" + prog + "/main.js", //This will end up as the fully compiled file for the program, so this is good too :)
                                  controller: prog+"Ctrl"
                              })
                          }
                      };
                      console.log("ADDING STATE ["+item.label+"]: ",state);
                      app._stateProvider.state(stateName, state);
                  }
                  else{ //Else it's a library, add to require
                      var paths={};
                      require.config({packages:["programs/"+prog]});       //Make this take existing array and add to it if need be.
                      console.log("Adding Package: ["+"programs/"+prog+"]")
                   
                  }
  
              });
              //OK... we don't know the state we've been asked for (not via URL routing)
              $rootScope.$on("$stateNotFound", function(event,unfoundState,fromState,fromParams){
                  console.log("State not Found!", unfoundState);
              });
  
              app._urlRouterProvider.otherwise("/");
             
              angularAMD.processQueue(); //Process things added to config/run blocks
  
              console.log("RE-ENABLE ROUTING ["+$location.url()+"] : "+$location.absUrl());
              $urlRouter.sync();
              $urlRouter.listen();
  
          });
      }]);
     
      console.log("App Module: Run Block 1 Defined");
      angularAMD.bootstrap(app);
      console.log("App Module: Bootstrap called");  
    });
   
    return app;
});