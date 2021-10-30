// importera allt som krävs
const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const ts = require('gulp-typescript');

// sökvägar för filer
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/js/*.js",
    imgPath: "src/assets/*",
    imgPubPath: "pub/assets/*",
    sassPath: "src/css/*.scss",
    tsPath: "src/js/*.ts"

}

function tsTask() {
    return src(files.tsPath)
        .pipe(ts({ outFile: 'compiledTs.js', removeComments: true }))
        .pipe(dest('src/js/'))
}

// HTML-task, kopierar HTML från src till pub
function copyHTML() {
    return src(files.htmlPath)
        // vart filerna ska flyttas
        .pipe(dest('pub'));
}

// SASS to CSS
function sassCompiler() {
    return src(files.sassPath)
        // intiera sourcemaps som kartlägger filerna
        .pipe(sourcemaps.init())
        // kompilera sass till CSS
        .pipe(sass({includePaths: ['node_modules'], outputStyle: 'compressed'}).on('error', sass.logError))
        // utöka stöd fler fler webbläsare
        .pipe(autoprefixer())
        // skapa sourcemapen
        .pipe(sourcemaps.write("../maps"))
        // flytta filen
        .pipe(dest('pub/css'));
}

// JS-task
function jsTask() {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        // minifiera JS
        .pipe(terser())
        .pipe(sourcemaps.write("../maps"))
        .pipe(dest('pub/js/'))
}

// Img-task
function imgTask() {
    return src(files.imgPath)
        .pipe(dest('pub/assets'))
}

// Compress images
function imgCompress() {
    return src(files.imgPubPath)
        // komprimera bilder
        .pipe(imagemin([
            // inställningar som används vid komprimering
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 50, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest(files.imgPubPath))
}

// Watch-task
function watchTask() {
    // watch lyssnar efter förändringar
    // lyssna efter förändringar i files.imgPath, och om det sker förändringar, kör imgTask och imgcompress
    watch([files.imgPath], series(imgTask, imgCompress))
    watch([files.htmlPath], copyHTML)
    watch([files.sassPath], sassCompiler)
    watch([files.tsPath], tsTask)
    watch([files.jsPath], jsTask)
}

// Liveserver with reload
function liveServer() {
    // rotmappen för servern är pub
    return src('pub/')
        // starta live server
        .pipe(server({
            livereload: true,
            open: true,
            port: 8002
        }));
}

// exportera tasks så de går att köras från terminalen 
// default är den som körs om kommandot "gulp" körs
exports.default = series(
    liveServer,
    watchTask
)

// för att köra denna skrivs "gulp imgHandler" 
exports.imgHandler = series(
    imgTask,
    imgCompress
)

exports.tsTask = tsTask;

exports.build = parallel(
    series(imgTask, imgCompress),
    parallel(copyHTML, sassCompiler, jsTask, imgTask)
)

