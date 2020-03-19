const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

function createLibFile() {
  return src([
    'node_modules/codemirror/lib/codemirror.js',
    'node_modules/codemirror/mode/meta.js',
    'node_modules/codemirror/addon/mode/loadmode.js',
    'node_modules/codemirror/addon/mode/overlay.js',
    'node_modules/codemirror/addon/edit/matchbrackets.js',
    'node_modules/codemirror/addon/edit/matchtags.js',
    'node_modules/codemirror/addon/runmode/runmode.js',
    'node_modules/codemirror/addon/runmode/colorize.js',
    'node_modules/codemirror/addon/search/match-highlighter.js',
    'node_modules/codemirror/addon/selection/active-line.js',
    'node_modules/codemirror/addon/fold/brace-fold.js',
    'node_modules/codemirror/addon/fold/comment-fold.js',
    'node_modules/codemirror/addon/fold/foldcode.js',
    'node_modules/codemirror/addon/fold/foldgutter.js',
    'node_modules/codemirror/addon/fold/indent-fold.js',
    'node_modules/codemirror/addon/fold/markdown-fold.js',
    'node_modules/codemirror/addon/fold/xml-fold.js'
  ])
    .pipe(concat('codemirror.js'))
    .pipe(uglify())
    .pipe(dest('src/assets/js'));
}

function copyModes() {
  return src('node_modules/codemirror/mode/*/*.js')
    .pipe(uglify())
    .pipe(dest('src/assets/modes'));
}

exports.preBuild = parallel(createLibFile, copyModes);

// marked is bundled in angular.json because it's just 24kb uncompressed
