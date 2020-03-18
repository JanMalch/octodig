const { stripMdi } = require('./gulp/strip-mdi');
const { preBuild } = require('./gulp/pre-build');

exports.stripMdi = stripMdi;
exports.preBuild = preBuild;
exports.default = preBuild;
