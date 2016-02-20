var del = require('del'),
	 	colour = require('colour'),
	 	runSequence = require('run-sequence');

var gulp = require('gulp'),
		juice = require('gulp-juice'),
		jade = require('gulp-jade'),
	 	plumber = require('gulp-plumber'),
		stylus = require('gulp-stylus');


// vars Block


var Production = false;


// Loggers Block


var error_logger = function(error) {
	console.log([
		'',
		'---------- ERROR MESSAGE START ----------'.bold.red.inverse,
		'',
		(error.name.red + ' in ' + error.plugin.yellow),
		'',
		error.message,
		'----------- ERROR MESSAGE END -----------'.bold.red.inverse,
		''
	].join('\n'));
}

var watch_logger = function(event) {
	console.log('File ' + event.path.green + ' was ' + event.type.yellow + ', running tasks...');
}


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
		.pipe(juice())
		.pipe(gulp.dest('build'));
});

gulp.task('images', function(){
	return gulp.src(['src/img/**', 'src/mails/**/*.{jpg,png}'])
		.pipe(gulp.dest('build'));
});

gulp.task('clean:before', function(callback) {
	return del('build', callback);
});

gulp.task('clean:after', function(callback) {
	return del('src/**/*.css', callback);
});

gulp.task('production', function(callback) {
	Production = true;
	callback();
});


// Run Block


gulp.task('dev', function() {
	gulp.watch(['src/**', '!src', '!src/*.css'], ['default']).on('change', watch_logger);
});

gulp.task('default', function(callback) {
	runSequence('clean:before', ['stylus', 'images'], 'jade', 'clean:after', callback);
});

gulp.task('build', function(callback) {
	runSequence('production', 'clean:before', ['stylus', 'images'], 'jade', 'clean:after', callback);
});