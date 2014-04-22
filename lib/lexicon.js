/**
 * Lexicon.js
 *
 * @author Sergey Kamardin <gobwas@gmail.com>
 */

(function(root, factory) {

    var isCJS, isAMD,
        underscore;

    isCJS = typeof module === "object"   && module.exports;
    isAMD = typeof define === "function" && define.amd;

    if (isCJS) {
        underscore = require("underscore");
        module.exports = factory(underscore);
    } else if (isAMD) {
        define(["underscore"], function(underscore) {
            return factory(underscore);
        });
    } else {
        underscore = root._;
        return factory(underscore);
    }

})(this, function(_) {

    "use strict";

    var Lexicon = (function() {

        var __remapMap = function _remapMap(neighboors) {
            var defaultLevel = neighboors[Lexicon.DEFAULT] || null;

            return _.reduce(neighboors, function(remapped, neighboor, key) {

                remapped[key] = neighboor;

                if (_.isObject(neighboor) && key !== Lexicon.DEFAULT) {
                    remapped[key] = _remapMap((defaultLevel && _.isObject(defaultLevel) && _.extend({}, defaultLevel, neighboor)) || neighboor);
                }

                return remapped;

            }, {});
        };

        return function Lexicon(map) {

            var _cacheStorage = {};

            var _cacheManager = function(path, value) {
                var _path = _.clone(path),
                    key = _path.pop();

                var node = _.reduce(_path, function(cache, key) {
                    cache[key] || (cache[key] = {});
                    return cache[key];
                }, _cacheStorage);

                return value ? node[key] = value : node[key];
            };

            this.map = __remapMap(map);

            this.getCache = function(path) {
                return _cacheManager(path);
            };

            this.setCache = function(path, message) {
                _cacheManager(path, message);
            };
        }
    })();

    Lexicon.prototype = {
        constructor: Lexicon,

        getMessage: (function() {
            /**
             *
             * @param root
             * @param path
             * @returns {string|null}
             */
            var resolvePath = function(root, path) {
                var node = root,
                    leaf;

                for (var x = 0; x < path.length; x++) {
                    leaf = node[path[x]] || node[this.constructor.DEFAULT] || null;

                    if (_.isObject(leaf)) {
                        node = leaf;
                        continue;
                    }

                    if (_.isString(leaf)) {
                        return leaf;
                    }

                    break;
                }

                return null;
            };


            return function(path, data) {
                var message,
                    messageCached;

                if (messageCached = this.getCache(path)) {
                    if (_.isFunction(messageCached)) {
                        return messageCached(data);
                    }

                    return messageCached;
                }

                message = resolvePath.call(this, this.map, path);

                if (_.isString(message)) {
                    var isTemplate = _.some(_.templateSettings, function(val) {
                        var regexp = new RegExp(val);
                        return regexp.test(message);
                    });

                    if (isTemplate) {
                        var tpl = _.template(message);
                        this.setCache(path, tpl);

                        return tpl(data);
                    }

                    this.setCache(path, message);

                    return message;
                }

                return null;
            }
        })(),

        getError: function(path, data) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.ERROR);

            return this.getMessage(expanded, data);
        },

        getInfo: function(path, data) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.INFO);

            return this.getMessage(expanded, data);
        },

        getApi: function(path, data) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.API);

            return this.getMessage(expanded, data);
        }
    };

    _.extend(Lexicon, {
        INFO:    'info',
        WARNING: 'warning',
        ERROR:   'error',
        API:     'api',
        DEFAULT: '__default'
    });


    return Lexicon;
});