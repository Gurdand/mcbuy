const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
//const run = require("run-sequence");
const del = require("del");
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

gulp.task('sass', function() {
    return gulp.src(['scss/style.scss', 'scss/template_styles.scss'])
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function() {
    return gulp.src('*.html')
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
    return gulp.src('js/**/*.js')
    .pipe(gulp.dest('docs/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function() {
    return gulp.src('css/**/*.html')
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({ stream: true }));
});
   
gulp.task('allimg', function() {
    return gulp.src('images/**/*.{png,jpg}')
    .pipe(gulp.dest('docs/images'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function() {
    return gulp.src('docs/images/**/*.{png,jpg}')
    .pipe(imagemin([
        imagemin.jpegtran({ progressive: true }),
        imageminJpegRecompress({
            loops: 5,
            min: 65,
            max: 70,
        }),
        imagemin.optipng({ optimizationLevel: 3 }),
        pngquant({ quality: [0.65, 0.70], speed: 5 })
    ]))
    .pipe(gulp.dest('docs/images'));
});

gulp.task('svg', function() {
    return gulp.src('images/**/*.svg')
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    .pipe(cheerio({
        run: function($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "sprite.svg"
            }
        }
    }))
    .pipe(gulp.dest('docs/images'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "docs" 
        }
    });

    gulp.watch("scss/**/*.scss", gulp.series('sass'));
    gulp.watch("*.html", gulp.series('html'));
    gulp.watch("js/**/*.js", gulp.series('js'));
    gulp.watch("css/**/*.css", gulp.series('css'));
    gulp.watch("images/**/*.{png,jpg}", gulp.series('allimg'));
    gulp.watch("images/**/*.{svg}", gulp.series('svg'));
});

gulp.task('copy', function() {
    return gulp.src([
        'images/**',
        'js/**',
        'css/**',
        'fonts/**',
        '*.html'
    ], {
        base: '.'
    })
    .pipe(gulp.dest('docs'));
});

gulp.task('clean', function() {
    return del('docs');
});

// gulp.task('docs', function(fn) {
//     run(
//         'clean',
//         'copy',
//         'sass',
//         'images',
//         'svg',
//         fn
//     );
// });

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'sass',
    'images',
    'svg',
    function(fn) {
        fn();
    }
));