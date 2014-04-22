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

    var Lexicon = function () {
        this._tplCache = {};
    };

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
                    leaf = node[path[x]] || node[Lexicon.DEFAULT] || null;

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


            return function(messages, path, options) {
                var message,
                    messageCached, isTemplate, tpl;

                options = options || {};

                message = resolvePath.call(this, messages, path);

                if (_.isString(message)) {
                    if (!(tpl = this._tplCache[message])) {
                        isTemplate = _.some(_.templateSettings, function(val) {
                            var regexp;

                            regexp = new RegExp(val);

                            return regexp.test(message);
                        });

                        if (isTemplate) {
                            tpl = _.template(message);
                            this._tplCache[message] = tpl;
                        }
                    }

                    if (tpl) {
                        return tpl(options.data || {});
                    }

                    return message;
                }

                return null;
            }
        })(),

        getError: function(messages, path, options) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.ERROR);

            return this.getMessage(messages, expanded, options);
        },

        getInfo: function(messages, path, options) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.INFO);

            return this.getMessage(messages, expanded, options);
        },

        getApi: function(messages, path, options) {
            var expanded = _.clone(path);
            expanded.unshift(this.constructor.API);

            return this.getMessage(messages, expanded, options);
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