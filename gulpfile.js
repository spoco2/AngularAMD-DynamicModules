var gulp = require('gulp');
var del = require('del');
var fs = require("fs");
var path = require('path');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var requirejsOptimize = require('gulp-requirejs-optimize');
var templateCache = require('gulp-angular-templatecache');
var debug = require('gulp-debug');
var runSequence = require('run-sequence');
var inject = require('gulp-inject');
var replace = require('gulp-replace');


var OUTDIR = "dist/";
var BASE_URL = "app/";
var PROGRAMDIR = BASE_URL+"programs";
var MAIN_APP = BASE_URL+"main-app/src/init.js";
var CONFIG_FILE = BASE_URL+"main-app/src/init.js";
var APP_TEMPLATE_DIR = "main-app/templates";
var APP_TEMPLATES =  BASE_URL+APP_TEMPLATE_DIR+"/**/*.html";
var TEMPLATE_MODULE = "templateStorage";



function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

function prepareTemplates(templatePath,root) {
    console.log("Prepare Templates ["+templatePath+"] --> ["+root+"]");
    return gulp.src(templatePath)
        .pipe(debug({title: "Template["+templatePath+"] "}))
        .pipe(templateCache({root:root,templateHeader:" ",templateFooter:" "}));
};


gulp.task("cleanApp", function(cb){
    del([OUTDIR+"/main-app/**/*",OUTDIR+"index.html"], function(err, paths){
     // console.log('Deleted files/folders:\n',paths.join('\n'));
        console.log("=-=- Dist App folder cleaned "+paths.length);
      cb();
    })
});

gulp.task("cleanPrograms", function(cb){
    del([OUTDIR+"/programs/**/*"], function(err, paths){
        //console.log('Deleted files/folders:\n',paths.join('\n'));
        console.log("=-=- Dist Program folder cleaned "+paths.length);
        cb();
    })
});


function optimizeProgram(programName,excludeFolders) {
    console.log("optimizeProgram --> "+programName);
    var program =  "programs/"+programName+"/main";
    var excludes = ["app"]
    for(f in excludeFolders){
        if("programs/"+excludeFolders[f]+"/main" != program){
            excludes.push("programs/"+excludeFolders[f]+"/main");
        }
    }
    console.log("EXCLUDES = ",excludes);

    //First copy templates and css:
    gulp.src(path.join(PROGRAMDIR, programName,"/templates/**/*.html"))
        .pipe(gulp.dest(OUTDIR+"/programs/"+programName+"/templates"));
    gulp.src(path.join(PROGRAMDIR, programName,"/styles/**/*.css"))
        .pipe(gulp.dest(OUTDIR+"/programs/"+programName+"/tyles"));

    return gulp.src(path.join(PROGRAMDIR, programName, '/main.js'))
        .pipe(debug({title: "OPT: "+programName}))
        .pipe(requirejsOptimize({
            mainConfigFile: CONFIG_FILE,
            baseUrl: BASE_URL,
            removeCombined:true,
            findNestedDependencies: true,
            normalizeDirDefines: "all",
            optimize: "uglify2",    
            uglify2: {
                mangle: false    //Just during dev
            },
            name: program,
            exclude:["app"],//excludes,
            insertRequire:[program]
        }))
          //Now, pull all html templates and convert them into entries directly in the angular Template cache
        //This is inserted into the Template module file definition where the startTag is found (/modules/Templates.js)
        .pipe(inject( prepareTemplates(path.join(PROGRAMDIR,programName,"/templates/**/*.html"),path.join("programs/",programName,"/templates/")),{
            starttag:"/** @preserve inject:templates **/",
            endtag:"/** @preserve endinject **/",
            transform:function(filePath,file){
                    console.log(filePath,file);
                 return file.contents.toString('utf8')
             }
         }))
        .pipe(rename("main.js"))

        //Can't add to template cache for now as can't insert before on demand request
        //.pipe(addStream.obj(prepareTemplates(path.join(PROGRAMDIR, programName,"/templates/**/*.html"),path.join("programs/", programName,"templates"))))
        //.pipe(concat("main.js"))
        .pipe(gulp.dest(OUTDIR+"/programs/"+programName));
};

gulp.task("optimizePrograms", function(){
    var folders = getFolders(PROGRAMDIR);
    console.log("folders:",folders);
    var tasks = folders.map(function(folder){
        console.log("Optimizing "+folder);
        return optimizeProgram(folder, folders)}
    )
   // return optimizeFolder("staff");
    return merge(tasks);
});

gulp.task("optimizeApp", function () {
    console.log("optimizeApp");
    var javascriptStream = gulp.src(MAIN_APP)
        .pipe(debug({title: "OPT: "}));

    //Create single, optimized js file of all dependencies of main app
    return javascriptStream
        //Take main application as starting point, and run RequireJS Optimizer on it, which pulls in
        //all dependencies
        .pipe(requirejsOptimize({
            mainConfigFile: CONFIG_FILE,
            baseUrl: BASE_URL,
            removeCombined:true,
            findNestedDependencies: true,
            normalizeDirDefines: "all",
            optimize: "uglify2",  
            uglify2: {
                output: {
                    beautify: false
                },
                mangle: false    //Just during dev
            },
            name: "app"
        }))
         //Now, pull all html templates and convert them into entries directly in the angular Template cache
        //This is inserted into the Template module file definition where the startTag is found (/modules/Templates.js)
        .pipe(inject( prepareTemplates(APP_TEMPLATES,APP_TEMPLATE_DIR),{
            starttag:"/** @preserve inject:templates **/",
            endtag:"/** @preserve endinject **/",
            transform:function(filePath,file){
            //    console.log(filePath,file);
                return file.contents.toString('utf8')
            }
        }))
        .pipe(concat("app.js"))//Pull it all together into one file, app.js
        .pipe(gulp.dest(OUTDIR+"main-app")); //Write it out to the distribution directory
});

/**
 * Copy the main resources, and update index's urls to match
 * some moved dependencies
 */
gulp.task("copyResources", function () {
    gulp.src(BASE_URL+"index.html")
        .pipe(replace("bower_components/requirejs/require.js","main-app/require.js"))
        .pipe(replace("data-main=\"main-app/main.js\"","data-main=\"main-app/app.js\""))

        .pipe(gulp.dest(OUTDIR));

    gulp.src(BASE_URL+"main-app/images/**/*.*")
        .pipe(gulp.dest(OUTDIR+"main-app/images/"));

    gulp.src(BASE_URL+"main-app/config/**/*.*")
        .pipe(gulp.dest(OUTDIR+"main-app/config/"));

    gulp.src(BASE_URL+"main-app/fonts/**/*.*")
        .pipe(gulp.dest(OUTDIR+"main-app/fonts/"));

    gulp.src(BASE_URL+"main-app/styles/**/*.*")
        .pipe(gulp.dest(OUTDIR+"main-app/styles/"));

    gulp.src(BASE_URL+"bower_components/angular-material/angular-material.css")
        .pipe(gulp.dest(OUTDIR+"main-app/styles/"));

    gulp.src(BASE_URL+"bower_components/requirejs/require.js")
        .pipe(gulp.dest(OUTDIR+"main-app/"));
});

gulp.task('main', function(callback) {
    runSequence('cleanApp',"optimizeApp","copyResources", callback);
});
gulp.task('programs', function(callback) {
    runSequence('cleanPrograms',"optimizePrograms", callback);
});

gulp.task('default', ['main','programs']);