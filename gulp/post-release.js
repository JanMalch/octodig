const { src, dest } = require('gulp');
const replace = require('gulp-replace');
const pkgJson = require('../package');

function updateIndexWithVersion() {
  return src('src/index.html')
    .pipe(replace(/<meta name="version" content=".+?" \/>/g, `<meta name="version" content="${pkgJson.version}" />`))
    .pipe(dest('src/'));
}

exports.postRelease = updateIndexWithVersion;
