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

    var Lexicon = function (options) {
        this.options = _.extend({}, Lexicon.DEFAULTS, options);
        this.options.key = _.extend({}, Lexicon.DEFAULTS.key, this.options.key);

        this._tplCache = {};
    };

    Lexicon.prototype = {
        constructor: Lexicon,

        _resolvePath: function(obj, path, index, parents, crumps, reverse) {
            var key, value, defaultKey;

            defaultKey = this.options.key._;

            index   = index   || 0;
            parents = parents || [obj];
            reverse = reverse || false;
            crumps  = crumps  || [];

            if (index < 0) {
                return null;
            }

            if (reverse) {
                for (var x in obj) {
                    if (obj.hasOwnProperty(x)) {
                        // find first node matching fallback criteria
                        if (x == defaultKey) {
                            if (_.indexOf(crumps, obj[x]) == -1) {
                                value = obj[x];
                                crumps.push(value);
                                break;
                            }
                        }
                    }
                }
            } else if (key = path[index]) {
                value = obj[key];
            } else {
                return null;
            }
            
            if (_.isUndefined(value)) {
                if (reverse) {
                    index-= 1;
                }

                return this._resolvePath(parents[index], path, index, parents, crumps, true);
            } else {
                if (_.isObject(value)) {
                    index+= 1;
                    parents[index] = value;
                    return this._resolvePath(value, path, index, parents, crumps, false);
                }

                return value;
            }
        },

        getMessage: function(messages, path, options) {
            var message,
                messageCached, isTemplate, tpl;

            options = options || {};

            message = this._resolvePath(messages, path);

            if (_.isString(message)) {
                isTemplate = this._tplCache[message] || _.some(_.templateSettings, function(val) {
                    var regexp;

                    regexp = new RegExp(val);

                    return regexp.test(message);
                });

                if (isTemplate) {
                    if (!(tpl = this._tplCache[message])) {
                        tpl = _.template(message);
                        this._tplCache[message] = tpl;
                    }

                    return tpl(options.data || {});
                }

                return message;
            }

            return null;
        },

        getError: function(messages, path, options) {
            var expanded = _.clone(path);
            expanded.unshift(this.options.key.error);

            return this.getMessage(messages, expanded, options);
        },

        getInfo: function(messages, path, options) {
            var expanded = _.clone(path);
            expanded.unshift(this.options.key.info);

            return this.getMessage(messages, expanded, options);
        }
    };

    Lexicon.DEFAULTS = {
        key: {
            _:       '_',
            info:    'info',
            error:   'error'
        }
    };


    return Lexicon;
});