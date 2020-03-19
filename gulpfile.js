const { stripMdi } = require('./gulp/strip-mdi');
const { preBuild } = require('./gulp/pre-build');
const { preRelease } = require('./gulp/pre-release');

exports.stripMdi = stripMdi;
exports.preBuild = preBuild;
exports.preRelease = preRelease;
