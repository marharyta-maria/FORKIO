import gulp from "gulp";
import gulpClean from "gulp-clean";
import dartSaas from "sass";
import gulpSass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";

const sass = gulpSass(dartSaas);
const bs = browserSync.create()

const cleanDist = () => gulp.src("./dist/*", {"read": false})
.pipe(gulpClean());

const buildCSS = () => gulp.src("./src/styles/**/*.scss")
.pipe(sass())
.pipe(concat("styles.min.css"))
.pipe(cleanCss())
.pipe(autoPrefixer())
.pipe(gulp.dest("./dist/"))

const buildJS = () => gulp.src("./src/**/*.js")
.pipe(concat("scripts.min.js"))
.pipe(terser())
.pipe(gulp.dest("./dist/"))

const imgMinify = () => gulp.src("./src/img/**/*")
.pipe(imagemin())
.pipe(gulp.dest("./dist/img/"))

const innerbuild = gulp.series(buildCSS, buildJS);
export const build = gulp.series(cleanDist, gulp.parallel(buildCSS, buildJS, imgMinify))

export const dev = gulp.series(innerbuild, () => {
    bs.init({
        server: {
            baseDir: "./"
        },
    });
    gulp.watch(
        "./src/**/*",
        gulp.series(innerbuild, (done) => {
            bs.reload();
            done();
        })
    );
    gulp.watch(
        "./index.html",
        gulp.series(innerbuild, (done) => {
            bs.reload();
            done();
        })
    );
});