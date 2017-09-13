# HTML Starterkit with Bower and Gulp (with Sass)
This starterkit was developed for easy setting up small test environments with Bower and Gulp. I use this kit when trying new stuff in the JS-world or testing out random APIs.

## Install dependencies

Dev dependencies are:
- gulp
- del
- gulp-concat
- gulp-sass
- gulp-rename
- gulp-strip-comments
- gulp-sourcemaps
- gulp-autoprefixer

Run `npm install` in root directory. After this you'll get a new directory `./node_modules` where all npm modules are installed.

To init Bower run `bower init` and follow the steps on your command line.

## Install other dependencies
Run `bower install --save <dependency>`

e.g. `bower install --save bootstrap-sass` to install Twitter Bootstap.

The dependencies are downloaded into `./vendor/bower_components`

To use dependencies in your webroot (`./public`) use Gulp

## Gulp

Dependencies are prepared in gulpfile.js

e.g. if you installed Twitter Bootstrap via Bower you'll need to copy the JS files into webroot and also compile SASS files and move the resulting CSS to production. This all is done via Gulp.

### Copfiles
First we'll merge dependencies for different parts of your UI (e.g. if every UI uses Bootstrap and Angular, you can merge both to a single file). Therefor you have to copy your files to the `./source/js` directory.

Modify the task `copyfiles` in your gulpfile:
```javascript
gulp.task("copyfiles", function() {

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


});
```
You'll end up with the copied files in `./source`.

### Clean
At this step we also want to provide the `clean` task in gulpfile. When we look into our gulpfile, there are already some paths configured:
```javascript
gulp.task('clean', function(cb) {
	del([
		'source/css/**/*',
		'source/js/**/*',
		'source/sass/**/*',
		'!source/sass/*.scss'
	], cb);
});
```
This will clear all css, js and sass files from the `./source` directory except the sass files directly in `./source/sass`. This is for your own sass files, that include dependencies like bootstrap. We'll come to that later.

### Scripts
Next we'll merge the JS files, so we'll update the task `scripts`:
```javascript
gulp.task('scripts', function() {
	// App
	gulp.src([
		'source/js/jquery.js',
		'source/js/bootstrap.js'
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('public/js'));
});
```
This'll create a file app.js in `./public/js/` which contains merged contents of jQuery and Bootstrap.

### Sass
Next up is the SASS Compiler. We'll also solve this with Gulp in the designated task `sass`. But first we have to import bootstrap in our `style.scss`:
```scss
/*========================================================
================== IMPORT DEPENDENCIES ===================
========================================================*/

@import 'bootstrap/_bootstrap';

/*========================================================
==================== CUSTOM VARIABLES ====================
========================================================*/

$body-bg: #000;
$text-color: #fff;

/*========================================================
====================== CUSTOM STYLES =====================
========================================================*/

h1 {
	color: #f00;
}

/*========================================================
================ IMPORT RESPONSIVE STYLES ================
========================================================*/

@import 'responsive';
```
First we added bootstrap with `@import`, then overwrote some bootstrap variables. To compile this sass file we have a look in our Gulpfile:
```javascript
gulp.task('sass', function() {
	gulp.src('source/sass/style.scss')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer("last 10 versions"))
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/css'));
});
```
The predefined gulpfile in this starterkit also includes sourcemaps and autoprefix so we'll also use them in the sass compilation above. The main starting file for sass compilation in this starterkit is `./soure/sass/style.scss`. To ensure working sass compilation add your dependencies here and also import other custom sass files here.

To use the auto compile function, when your sass changes, we'll have a look into your gulpfile:
```javascript
gulp.task('watch', function() {
	gulp.watch([
		'source/sass/style.scss',
		'source/sass/responsive.scss'
	], ['sass']);
});
```
This will watch the files `style.scss` and `responsive.scss` for changes. You can start the watch task with `gulp watch`.

The file `responsive.scss` in `./source/sass/` is designated to hold your responsive styles and different media queries. For better flexibility the file isn't prefilled with any media queries, but you can add them, e.g. for bootstrap like following:
```scss
/* Small devices (tablets, 768px and up) */
@media (min-width: $screen-sm-min) {
	body {
		color: #0f0;
	}
}

/* Medium devices (desktops, 992px and up) */
@media (min-width: $screen-md-min) {

}

/* Large devices (large desktops, 1200px and up) */
@media (min-width: $screen-lg-min) {

}

/* Only Mobile */
@media (max-width: $screen-xs-max) {

}

/* Only Desktop */
@media (max-width: $screen-md-max) {

}

/* Only Tablet */
@media (max-width: $screen-sm-max) {

}

/* Only mobile */
@media (max-width: $screen-xs-max) {

}
```

### Html
Our main index file is in `./public/index.html`. It inherits a basic HTML structure. We'll have to include our scripts and stylesheets here:
```html
<!DOCTYPE html>
<html>
	<head>
		<title>Bower-Gulp-Starterkit</title>
		<meta charset="utf-8"/>

		<!-- Stylesheets -->
		<link rel="stylesheet" type="text/css" href="css/style.css"/>

		<!-- Scripts -->
		<script type="text/javascript" src="js/app.js"></script>

		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	</head>
	<body>
		...
	</body>
</html>
```

## License
This project is licensed under the MIT License (MIT). For more information have a look at License.md.

Feel free to use this starterkit as basis to your projects.