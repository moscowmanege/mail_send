var del = require('del');
var runSequence = require('run-sequence');

var gulp = require('gulp');
var	juice = require('gulp-juice');
var	jade = require('gulp-jade');
var	stylus = require('gulp-stylus');

gulp.task('stylus', function(){
	return gulp.src('src/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('src'));
});

gulp.task('jade', function() {
	return gulp.src('src/mails/**/*.jade')
		.pipe(jade({pretty: true}))
		.pipe(juice())
		.pipe(gulp.dest('build'));
});

gulp.task('clean:before', function(callback) {
	return del(['build/**', '!build', '!build/.gitignore'], callback);
});

gulp.task('clean:after', function(callback) {
	return del('src/**/*.css', callback);
});

gulp.task('default', function(callback) {
	runSequence('clean:before', 'stylus', 'jade', 'clean:after', callback);
});