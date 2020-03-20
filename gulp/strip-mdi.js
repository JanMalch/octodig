const chalk = require('chalk');
const log = require('fancy-log');
const { src, dest } = require('gulp');
const debug = require('gulp-debug');
const svgson = require('svgson');
const through = require('through2');

const staticallyUsedIcons = [];

function findUsages(regex, vinylFile, callback) {
  const transformedFile = vinylFile.clone();
  const str = transformedFile.contents.toString('utf8');
  let m;

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    callback(m);
  }
}

function findMatIcons() {
  return through.obj((vinylFile, encoding, callback) => {
    findUsages(/<mat-icon .*?svgIcon="(.+?)".*?>/gim, vinylFile, m => staticallyUsedIcons.push(m[1]));
    callback(null);
  });
}

const _logResult = allIcons => {
  const total = allIcons.length;
  const pct = '(' + ((staticallyUsedIcons.length * 100) / total).toFixed(2) + '%)';
  log(`Keeping ${staticallyUsedIcons.length} of ${total} icons ${chalk.greenBright(pct)}`);
};

function stripSvg(keepIcons) {
  return through.obj((vinylFile, encoding, callback) => {
    keepIcons.forEach(icon => staticallyUsedIcons.push(icon));
    const transformedFile = vinylFile.clone();
    const parsed = svgson.parseSync(transformedFile.contents.toString('utf8'));
    const allIcons = parsed.children[0].children;
    const keptIcons = allIcons.filter(icon => staticallyUsedIcons.includes(icon.attributes.id));
    const newIconFile = {
      ...parsed,
      children: [
        {
          ...parsed.children[0],
          children: keptIcons
        }
      ]
    };
    _logResult(allIcons);
    transformedFile.contents = Buffer.from(svgson.stringify(newIconFile));
    callback(null, transformedFile);
  });
}

function stripMdi() {
  return src('src/app/**/*.{component.html,component.ts}')
    .pipe(debug({ title: `${chalk.yellow('⚠ EXPERIMENTAL ⚠  ')}Searching for <mat-icon> in`, showCount: false }))
    .pipe(findMatIcons())
    .pipe(src('dist/octodig/assets/mdi.svg'))
    .pipe(
      stripSvg([
        'chevron-down',
        'chevron-right',
        'battery-outline',
        'battery-10',
        'battery-20',
        'battery-30',
        'battery-40',
        'battery-50',
        'battery-60',
        'battery-70',
        'battery-80',
        'battery-90',
        'battery'
      ])
    )
    .pipe(dest(`dist/octodig/assets/`));
}

exports.stripMdi = stripMdi;
