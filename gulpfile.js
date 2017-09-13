var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    strip = require('gulp-strip-comments'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify');

var config = {
    sassPath: 'source/sass',
    bowerDir: 'vendor/bower_components'
}

gulp.task("copyfiles", function() {

    // Files from vendor/bower_components, where you need them
    // Copy jQuery
    gulp.src("vendor/bower_components/jquery/dist/jquery.js")
        .pipe(gulp.dest("source/js/"));

    // Copy Bootstrap
    gulp.src("vendor/bower_components/bootstrap-sass/assets/stylesheets/**")
        .pipe(gulp.dest("source/sass/bootstrap"));
    gulp.src("vendor/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js")
        .pipe(gulp.dest("source/js/"));
    gulp.src("vendor/bower_components/bootstrap-sass/assets/fonts/**")
        .pipe(gulp.dest("public/fonts"));

    // Copy Fontawesome
    gulp.src("vendor/bower_components/font-awesome/scss/**")
        .pipe(gulp.dest("source/sass/font-awesome"));
    gulp.src("vendor/bower_components/font-awesome/fonts/**")
        .pipe(gulp.dest("public/fonts"));
});

gulp.task('clean', function(cb) {
    del([
        'source/css/**/*',
        'source/js/**/*',
        'source/sass/**/*',
        '!source/sass/*.scss',
        '!source/sass/mixins/*.scss',
        '!source/sass/components/*.scss'
    ], cb);
});


gulp.task('scripts', function() {

    // Merge scripts here
    // App
    gulp.src([
            'source/js/jquery.js',
            'source/js/bootstrap.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./public",
        index: "guide.html"
    });

    gulp.watch(["source/sass/*.scss", "source/sass/*/*.scss"], ["sass"]);
    gulp.watch(['public/*.html']).on('change', browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src('source/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer("last 10 versions"))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function() {

    // Run css concat or minify here

});


gulp.task('watch', function() {
    gulp.watch([
        'source/sass/*.scss'
    ], ['sass']);

});

gulp.task('default', ['scripts', 'sass', 'css', 'serve']);