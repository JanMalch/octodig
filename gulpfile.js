const { stripMdi } = require('./gulp/strip-mdi');
const { preBuild } = require('./gulp/pre-build');
const { postRelease } = require('./gulp/post-release');

exports.stripMdi = stripMdi;
exports.preBuild = preBuild;
exports.postRelease = postRelease;
