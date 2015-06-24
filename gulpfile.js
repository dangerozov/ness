var gulp = require("gulp"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat");

// JS
gulp.task("js", function() {
	gulp.src(["./src/nessy/*.js"])
		.pipe(concat("nessy.js"))
		.pipe(gulp.dest("./public/js"));
});