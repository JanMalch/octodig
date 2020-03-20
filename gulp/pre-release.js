const { src, dest, series } = require('gulp');
const replace = require('gulp-replace');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

let nextVersion;

function determineNextVersion() {
  return exec('npx standard-version --dry-run').then(result => {
    const str = result.stdout;
    const regex = /tagging release v(.+)/m;
    let m;

    if ((m = regex.exec(str)) !== null) {
      nextVersion = m[1];
    }
    if (nextVersion == null) {
      throw new Error('Unable to determine next version');
    }
  });
}

function updateIndexWithVersion() {
  return src('src/index.html')
    .pipe(replace(/<meta name="version" content=".+?" \/>/g, `<meta name="version" content="${nextVersion}" />`))
    .pipe(dest('src/'));
}

exports.preRelease = series(determineNextVersion, updateIndexWithVersion);
