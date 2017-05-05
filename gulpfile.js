/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   15-09-2016
* @Email:  contact@nicolasfazio.ch
* @Last modified by:   webmaster-fazio
* @Last modified time: 10-02-2017
*/

// importer les modules NPM
var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require("browserify");
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var removeHtmlComments  = require('gulp-remove-html-comments');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Config of project folders
var config = {
    pages     : ['dev/www/*.html'], 
    materialize: ['dev/src/materialize/css/materialize.min.css'],
    materializeJS: ['dev/src/materialize/js/materialize.min.js'],
    materializeFONT: ['dev/src/materialize/fonts/**/*'],
    jquery: ['dev/src/jquery/jquery-3.1.1.min.js'],
    customCSS: ['dev/src/css/style.css'],
    IMG: ['dev/src/img/**.png'],
    desDir:    './dist' /* répértoire de destination (prod) */
}

// Default Gulp starting task
gulp.task("run",[
  'copy-mat-js',
  'copy-css',
  'copy-font',
  'build-js',
  'copy-html',
  'copy-img'
]);
gulp.task('default', ['run'], function() {
    gulp.start('startServer', 'watch');
});

// Task to build JS files
gulp.task("build-js", function(){
    return browserify("dev/app/app.js",{
        debug: true
    })
    .transform(babelify.configure({
        presets : ["es2015"]
    }))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.desDir + '/js'))
    .pipe(reload({stream:true}));
});
// Task to copy HTML files
gulp.task("copy-html", function(){
    return gulp.src(config.pages)
        .pipe(removeHtmlComments())
        .pipe(gulp.dest(config.desDir))
        .pipe(reload({stream:true}));
});

// Task to copy JS Mateialize files
gulp.task("copy-mat-js", function(){
    return gulp.src(config.materializeJS.concat(config.jquery))
        .pipe(gulp.dest(config.desDir+'/js'))
});

// Task to copy CSS Mateialize files
gulp.task("copy-font", function(){
    return gulp.src(config.materializeFONT)
        .pipe(gulp.dest(config.desDir+'/fonts'))
});

// Task to copy CSS Mateialize files
gulp.task("copy-css", function(){
    return gulp.src(config.materialize.concat(config.customCSS))
        .pipe(gulp.dest(config.desDir+'/css'))
        .pipe(reload({stream:true}));
});

// Task to copy img Mateialize files
gulp.task("copy-img", function(){
    return gulp.src(config.materialize.concat(config.IMG))
        .pipe(gulp.dest(config.desDir+'/img'))
});
// Task to run local server
gulp.task("startServer",  function() {
    browserSync.init({
      server: {
          baseDir: config.desDir
      },
      notify: true
    });
});
// Task to watch wich file is changing and load the right task
gulp.task('watch', function() {
  gulp.watch('./dev/app/**/*.js', ['build-js']);     // watch js file changes
  gulp.watch('./dev/**/*.html', ['copy-html']);      // watch all html template file changes
  gulp.watch(config.customCSS, ['copy-css']);   // Simply uncomment exemple and set your own params (files-to-watch && task-to-run).
  //gulp.watch('PATH-OF-FILES-TO-WATCH', ['TASK-TO-RUN']);   // Simply uncomment exemple and set your own params (files-to-watch && task-to-run).
})
