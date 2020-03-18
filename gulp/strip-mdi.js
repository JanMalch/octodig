const chalk = require('chalk');
const path = require('path');
const log = require('fancy-log');
const { src, dest } = require('gulp');
const debug = require('gulp-debug');
const { parseSync, stringify } = require('svgson');
const through = require('through2');

const staticallyUsedIcons = [];
const componentsWithDynamicUsages = new Set();

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
    // static usages
    findUsages(/<mat-icon .*?svgIcon="(.+?)".*?>/gim, vinylFile, m => staticallyUsedIcons.push(m[1]));

    // dynamic usages
    findUsages(/<mat-icon .*?\[svgIcon]="(.+?)".*?>/gim, vinylFile, m => {
      const fileName = path.relative(__dirname + '/..', vinylFile.path);
      if (!componentsWithDynamicUsages.has(fileName)) {
        log(chalk.yellow(`${fileName} uses a dynamic mat-icon: ${m[0]}`));
        componentsWithDynamicUsages.add(fileName);
      }
    });

    callback(null);
  });
}

function stripSvg(keepIcons) {
  return through.obj((vinylFile, encoding, callback) => {
    if (Array.isArray(keepIcons)) {
      keepIcons.forEach(icon => staticallyUsedIcons.push(icon));
    } else if (typeof keepIcons === 'object' && !!keepIcons) {
      const givenFiles = Object.values(keepIcons)
        .flat()
        .map(file => path.relative(__dirname + '/..', path.resolve(file)));

      const givenFilesButNotFound = givenFiles.filter(fileName => !componentsWithDynamicUsages.has(fileName));
      if (givenFilesButNotFound.length > 0) {
        log.error('Files passed to stripSvg do not have dynamic usages:\n- ' + Array.from(new Set(givenFilesButNotFound)).join('\n- '));
      }

      const foundFilesButNotGiven = Array.from(componentsWithDynamicUsages).filter(comp => !givenFiles.includes(comp));
      if (foundFilesButNotGiven.length > 0) {
        log.error('Found files with dynamic usages that are not listed:\n- ' + Array.from(new Set(foundFilesButNotGiven)).join('\n- '));
      }

      Object.keys(keepIcons).forEach(icon => staticallyUsedIcons.push(icon));
    }

    const transformedFile = vinylFile.clone();
    const parsed = parseSync(transformedFile.contents.toString('utf8'));
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
    const total = allIcons.length;
    const pct = '(' + ((staticallyUsedIcons.length * 100) / total).toFixed(2) + '%)';
    log(`Keeping ${staticallyUsedIcons.length} of ${total} icons ${chalk.greenBright(pct)}`);
    transformedFile.contents = Buffer.from(stringify(newIconFile));
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
