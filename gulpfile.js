var gulp   = require('gulp');
var less   = require('gulp-less');
var concat = require('gulp-concat');
var htmlmin= require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var rev    = require('gulp-rev');
var newer  = require('gulp-newer');
var ngann  = require('gulp-ng-annotate');
var tsc    = require('gulp-tsc');
var ptsc   = require('gulp-typescript');
var srcmps = require('gulp-sourcemaps');
var del    = require('del');
var http   = require('http');
var svr    = require('serve-static');
var open   = require('open');
var conn   = require('connect');
const config  = require('./gulpconfig.json');


gulp.task('clean', function(done){
        console.log('     Cleaning A2 project...');
	return del([config.dest, config.jdest], done);
});


gulp.task('pts', ['ptsc'], function(done) {
	console.log('     Compiling Typescript....PTS');
	  var tsResult = gulp.src([config.tsrc,'node_modules/angular2/typings/browser.d.ts'])
	    .pipe(srcmps.init())
	    .pipe(ptsc(config.compilerOpts))
  	    .pipe(uglify())
            .pipe(srcmps.write(config.jmdest))
	    .pipe(gulp.dest(config.jdest));
	  return tsResult.js;
});


gulp.task('ptsc', ['clean'], function() {
    console.log('     Compiling PTSC');
    const tsProject = ptsc.createProject(config.tsconfig);
    return gulp.src([config.tsrc,'node_modules/angular2/typings/browser.d.ts'], {base: config.dest}) 
        .pipe(newer({dest: config.jsrc, ext: '.js'}))
        .pipe(srcmps.init())
        .pipe(ptsc(tsProject))
        .pipe(uglify())
        .pipe(srcmps.write(config.jmdest))
        .pipe(gulp.dest(config.dest))
});


gulp.task('ts', ['clean'], function () {
        console.log('     Compiling Typescript ....TS');
        var tsResult = gulp
                .src([config.tsrc,'node_modules/angular2/typings/browser.d.ts'])
		.pipe(srcmps.init())
                .pipe(tsc(config.compilerOptions))
	        .pipe(srcmps.write())
	        .pipe(gulp.dest(config.dest));
        return tsResult.js;
});


gulp.task('tsc', ['clean'], function(){
        console.log('     Compiling typescript with TSC');
        return gulp.src([config.tsrc,'node_modules/angular2/typings/browser.d.ts'], {base: config.dest})
                .pipe(srcmps.init())
                .pipe(tsc(config.compilerOptions))
                .pipe(srcmps.write())
                .pipe(gulp.dest(config.dest));
});


gulp.task('js', ['tsc'], function (callback) {
	console.log('     PreProcessing JavaScript');
	gulp.src(config.jsrc)
	    .pipe(srcmps.init())	
	    .pipe(concat(config.appname))
	    .pipe(ngann()) 	
	    .pipe(uglify()) 	
	    .pipe(srcmps.write())
	    .pipe(gulp.dest(config.dest))
	    callback(); 
})

gulp.task('jslib-concat', ['js'], function() {
	console.log('     Library JavaScript concat');
	return gulp.src(config.lib)
        .pipe(newer(config.dest+config.appname))
        .pipe(concat(config.appname))
        .pipe(gulp.dest(config.dest))
});


gulp.task('less', function(){
	console.log('     PreProcessing CSS');
	return gulp.src(config.csrc)
		.pipe(concat(config.lessfn))
		.pipe(less({compress:true}))
		.pipe(gulp.dest(config.dest));
});


gulp.task('rev', ['less','js'], function(){
	console.log('     Static asset revisioning');
        return gulp.src(config.revsrc)
                .pipe(rev())
                .pipe(rev.manifest())
                .pipe(gulp.dest(config.dest));
});


gulp.task('rev-manifest', ['less', 'js'], function(){
	console.log('     Static html asset revisioning');
        return gulp.src(config.hsrc)
                .pipe(rev())
		.pipe(htmlmin({collapseWhitespace: true}))
                .pipe(rev.manifest("rev-manifest.json",{
                        merge: true
                }))
                .pipe(gulp.dest(config.dest));
});



gulp.task('deploy', ['rev'], function () {
	gulp.watch(config.tsrc,[tsc]);
	var app = conn().use(svr(__dirname));
        console.log('     Deploying at '+config.domain+config.port);
    	http.createServer(app).
	listen(config.port, function () {
        	open(config.domain+config.port);
    	});
});



gulp.task('watch', ['pts', 'less', 'cjs'], function(){
	gulp.watch(config.tsrc, ['pts']);	
 	gulp.watch(config.csrc, ['less']);
	gulp.watch(config.jsrc, ['cjs']);
});

gulp.task('build', ['ptsc', 'jslib-concat', 'rev-manifest', 'less']);

gulp.task('default', ['tsc', 'deploy']);
