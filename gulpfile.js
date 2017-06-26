var rimraf = require('rimraf'),
	 	runSequence = require('run-sequence');

var gulp = require('gulp'),
		util = require('gulp-util'),
		juice = require('gulp-juice'),
		jade = require('gulp-jade'),
	 	plumber = require('gulp-plumber'),
		stylus = require('gulp-stylus');


// vars Block


var Production = false;


// Loggers Block


var error_logger = function(error) {
	util.log([
		'',
		util.colors.bold.inverse.red('---------- ERROR MESSAGE START ----------'),
		'',
		(util.colors.red(err.name) + ' in ' + util.colors.yellow(err.plugin)),
		'',
		err.message,
		util.colors.bold.inverse.red('----------- ERROR MESSAGE END -----------'),
		''
	].join('\n'));
};

var watch_logger = function(event) {
	util.log([
		'File ',
		util.colors.green(event.path.replace(__dirname + '/', '')),
		' was ',
		util.colors.yellow(event.type),
		', running tasks...'
	].join(''));
};


// Tasks Block


gulp.task('stylus', function(){
	return gulp.src('src/**/*.styl')
		.pipe(plumber(error_logger))
		.pipe(stylus())
		.pipe(gulp.dest('src'));
});

gulp.task('jade', function() {
	return gulp.src('src/mails/**/*.jade')
		.pipe(plumber(error_logger))
		.pipe(jade({pretty: !Production, locals: { production: Production }}))
		.pipe(juice({webResources: { images: false } }))
		.pipe(gulp.dest('build'));
});

gulp.task('images', function(){
	return gulp.src(['src/img/**', 'src/mails/**/*.{jpg,png}'])
		.pipe(gulp.dest('build'));
});

gulp.task('clean:before', function(callback) {
	return rimraf('build', callback);
});

gulp.task('clean:after', function(callback) {
	return rimraf('src/**/*.css', callback);
});

gulp.task('production', function(callback) {
	Production = true;
	callback();
});


// Run Block


gulp.task('dev', function() {
	gulp.watch(['src/**/*.{styl,jade,jpg,png}'], ['default']).on('change', watch_logger);
});

gulp.task('default', function(callback) {
	runSequence('clean:before', ['stylus', 'images'], 'jade', 'clean:after', callback);
});

gulp.task('build', function(callback) {
	runSequence('production', 'clean:before', ['stylus', 'images'], 'jade', 'clean:after', callback);
});