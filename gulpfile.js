var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

gulp.task('wiredep', function(){
	return gulp.src(['src/index.html'])
		.pipe(wiredep())
		.pipe(gulp.dest('build'));
});