var cachify = require('connect-cachify-static');
var path = require('path');
var debug = require('debug')('postcss:cachify');

var cachifyUrl = require('./lib/cachify');

module.exports = function (opts) {
    opts = opts || {};
    opts.baseUrl = opts.baseUrl || '/';
    opts.basePath = opts.basePath ?
        path.resolve(opts.basePath) :
        process.cwd();

    if (opts.baseUrl[opts.baseUrl.length - 1] !== '/') {
        opts.baseUrl += '/';
    }

    opts.match = opts.match || /\.(svg|eot|woff|ttf|png|gif|jpg)$/;

    cachify.init(opts.basePath, {
        match: opts.match
    });

    debug('Options: %j', opts);

    opts.convertFn = cachify.cachify;

    return function (css) {
        css.replaceValues(/url\(.+\)/, {
            fast: 'url('
        }, function(v) {
            return cachifyUrl(v, opts);
        });
    };
};

module.exports.postcss = function (css) {
    return module.exports()(css);
};