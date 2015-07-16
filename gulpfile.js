var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var INJECT_OPTS = {
	addRootSlash	: false,
	relative		: true
};

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('wiredep', function(){
	return gulp.src(['src/index.html'])
		.pipe(wiredep())
		.pipe(gulp.dest('build'));
});

gulp.task('styles', function(){
	return gulp.src(['src/styles/styles.scss'])
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			precision: 10,
			errLogToConsole: true
		}))
		.pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('./build/styles'));
});

gulp.task('scripts', function(){
	return gulp.src('src/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest('build'));
});

gulp.task('inject', function(){
  var assets = gulp.src(['build/**/*.css', 'build/**/*.js']);
  return gulp.src(['build/index.html'])
    .pipe($.inject(assets, INJECT_OPTS))
    .pipe(gulp.dest('build'));
});

gulp.task('copy', function(){
	return gulp.src(['src/**/*.*', '!src/**/*.scss', '!src/**/*.js', '!src/index.html'])
		.pipe(gulp.dest('build'));
});

gulp.task('build', function(){
	runSequence(['styles', 'wiredep', 'scripts'], ['inject', 'copy']);
});

function serveCallback() {
	browserSync({
		server: ['build', './']
	});
}

gulp.task('serve', function(){
	runSequence(['styles', 'wiredep', 'scripts'], ['inject', 'copy'], serveCallback);
	gulp.watch(['src/**/*.html'], ['watch:html']);
	gulp.watch(['src/**/*.scss'], ['styles', reload]);
	gulp.watch(['src/**/*.js'], ['scripts', 'copy', reload]);
});

gulp.task('watch:html', function(){
	runSequence('wiredep', 'inject', reload);
});