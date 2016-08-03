(function () {

    var _ = {};

    _.isFunction = function isFunction(fn) {
        return typeof fn === 'function';
    };

    _.isUndefined = function isUndefined(el) {
        return el === undefined;
    };

    _.isNull = function isNull(nil) {
        return nil === null;
    };

    _.isObject = function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    };

    _.isString = function isString(str) {
        return typeof str === 'string';
    };

    _.isElement = function isElement(el) {
        return _.instanceof(el, Element);
    }

    _.isArray = function isArray(arr) {
        return Array.isArray(arr);
    };

    _.isNumber = function isNumber(num) {
        return typeof num === 'number' && !isNaN(num);
    };

    _.isXMLHTTPRequest = function isXMLHTTPRequest(xhr) {
        return _.instanceof(xhr, XMLHttpRequest)
    };

    _.instanceof = function isInstanceof(obj, instance) {
        return obj instanceof instance;
    };

    // FUNCTION HELPERS ==============
    _.noop = function noop(){};

    _.partial = function partial(fn) {

        if (!_.isFunction(fn)) {
            throw new Error('Expeced first argument to be of type "Function". Instead received ' + typeof fn);
        }

        if (arguments.length === 1) {
            return fn;
        }

        var partials = Array.prototype.slice.call(arguments, 1);

        return function partialFn() {

            // cp args;
            var args = [].slice.call(arguments, 0);

            // concat partialed args with the called args;
            return fn.apply(this, partials.concat(args));
        };
    };

    // Leading edge
    _.debounce = function debounce(fn, wait) {

        var called;

        return function() {

            var args    = arguments,
                context = this;

            if (!called) {
                called = true;

                setTimeout(function() {
                    called = false;
                }, wait);

                return fn.apply(context, args);
            }

        };

    };

    // COLLECTION HELPERS ==========
    _.each = function each(collection, iterator) {

        if (_.isArray(collection)) {

            for (var i = 0 ; i < collection.length ; i++) {
                iterator(collection[i], i, collection);
            }

        } else if (_.isObject(collection)) {

            for (var key in collection) {
                iterator(collection[key], key, collection);
            }
        }
    };

    _.last = function last(arr) {
        return _.isArray(arr) ? arr.slice(-1) : [];
    };

    _.map = function map(arr, iterator) {

        if (!_.isArray(arr) || !_.isFunction(iterator)) {
            return arr;
        }

        return _.reduce(arr, function (mem, el, i) {
            mem.push(iterator(el, i, arr));
            return mem;
        }, []);
    };

    _.reduce = function reduce(collection, iterator, memo) {

        _.each(collection, function (val, key, collection) {
            memo = iterator(memo, val, key, collection);
        });

        return memo;
    };

    _.get = function get(obj, path, fallback) {

        var paths, current_path, memo, i;

        if (_.isNull(obj) || _.isUndefined(obj)) {
            return fallback;
        }

        if (_.isString(path) && path.length) {

            paths = path.split('.');

        } else if (_.isArray(path)) {

            paths = path;

        } else {

            return fallback;
        }

        memo = obj;

        for (i = 0 ; i < paths.length ; i++) {

            current_path = paths[i];

            if (!memo.hasOwnProperty(current_path)) {
                return fallback;
            }

            memo = memo[current_path];
        }

        return memo;
    };

    // currently does not support arrays
    _.set = function set(obj, path, value) {

        var paths, current_path, memo, i, last_path;

        obj = _.isObject(obj) ? obj : {};

        if (_.isString(path) && path.length) {

            paths = path.split('.');

        } else if (_.isArray(path)) {

            paths = path;

        } else {

            return obj;
        }

        memo        = obj;
        last_path   = _.last(paths);

        // stop at last path;
        for (i = 0 ; i < paths.length - 1 ; i++) {

            current_path = paths[i];

            memo[current_path] = memo[current_path] || {};
            memo = memo[current_path];
        }

        memo[last_path] = value;
        return obj;
    };

    // base level merge for now;
    _.merge = function merge(dest_obj) {

        if (!_.isObject(dest_obj)) {
            return {};
        }

        if (arguments.length === 1) {
            return dest_obj;
        }

        // pull out dest_obj;
        var src_objs = Array.prototype.slice.call(arguments, 1);

        // for each src_obj, build out dest_obj;
        return _.reduce(src_objs, function (mem, obj) {

            if (!_.isObject(obj)) {
                return mem;
            }

            // combine keys from a src_obj;
            return _.reduce(obj, function (val, key) {
                mem[key] = val;
                return mem;
            }, mem);

        }, dest_obj);
    };

    // ELEMENT HELPERS ===========
    _.getElement = function getElement(el, get_all) {

        if (_.isElement(el)) {
            return el;
        }

        if (!_.isString(el)) {
            return null;
        }

        return _.isUndefined(get_all) ? document.querySelector(el) : document.querySelectorAll(el);
    };

    _.deleteChildNodes = function deleteChildNodes(el) {

        if (!_.isElement(el)) {
            return;
        }

        var range = document.createRange()
        range.selectNodeContents(el)
        range.deleteContents();

        return true;
    };

    _.keyPressed = function keyPressed(e) {

        var key_codes = {
            13: 'enter',
            27: 'escape',
            37: 'left_arrow',
            39: 'right_arrow'
        };

        return key_codes[e.which || e.keyCode];
    };

    // ASYNC HELPERS

    /**
     * [asyncParallel description]
     *
     *  asyncParallel(fns, function (err, results) {
     *  
     *  });
     *
     * for each fn in fns
     *     >> fn(cb);
     * 
     * @param  {[type]}   fns  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    _.asyncParallel = function asyncParallel(fns, done) {

        if (!_.isArray(fns)) {
            throw new Error('Expected first argument to be of type "Array". Instead received ' + typeof fns);
        }

        var len, n_completed, i, fn, ctx, has_resolved, results;

        n_completed     = 0;
        has_resolved    = false;
        len             = fns.length;
        results         = new Array(len);

        for (i = 0 ; i < fns.length ; i++) {

            fn  = fns[i];
            ctx = { index: i };

            _.isFunction(fn) ?
                fn(continueExecution.bind(ctx)) :
                continueExecution.call(ctx, new Error('Expected element in fns to be of type "Function". Instead received ' + typeof fn));
        }


        /**
         * [continueExecution description]
         *
         *  >> ctx is boudn to index of fn;
         *      >> bind index to properly place result of async fn
         *
         * >> toggle resolve on err to no longer continue && prevent calling done more than once;
         * 
         * @param  {[type]} err    [description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function continueExecution(err, result) {

            if (has_resolved) {
                return;
            }

            n_completed++;
            results[this.index] = result;

            if (err) {
                has_resolved = true;
                return done(err);
            }

            if (n_completed === len) {
                done(null, results);
            }
        }
    };


    // XHR HELPERS ==========

    /**
     * [setXHRListeners description]
     *
     * >> modified cb to handle actual responses based on statusCode;
     * >> http://blog.parse.com/learn/engineering/javascript-and-user-authentication-for-the-rest-api/
     *
     *
     * response {
     *     statusCode   : Integer,
     *     body         : Object,
     *     [message]    : String
     * }
     *
     * >> if parsing fails -- currently becomes a string
     *     >> perhaps should be in an obj;
     * 
     * @param {[type]}   xhr      [description]
     * @param {Function} callback [description]
     */
    _.setXHRListeners = function setXHRListeners(xhr, callback) {

        var xhr_events = ['onerror', 'ontimeout', 'onabort'];

        xhr_events.forEach(function (e) {
            xhr[e] = callback;
        });

        xhr.onload = callback.bind(xhr, null);

        return xhr;
    };

    _.isValidHttpVerb = function isValidHttpVerb(verb) {

        var http_verbs = {
            GET     : 1,
            PUT     : 1,
            POST    : 1,
            PATCH   : 1,
            DELETE  : 1
        };

        verb = verb.toUpperCase();

        return http_verbs.hasOwnProperty(verb);
    };

    /**
     * [setXHRHeaders description]
     *
     * TODO: SET DEFAULTS
     * 
     * @param {[type]} xhr     [description]
     * @param {[type]} headers [description]
     */
    _.setXHRHeaders  = function setXHRHeaders(xhr, headers) {

        if (!_.isXMLHTTPRequest(xhr)) {
            throw new Error('Expected "xhr" to be instance of "XMLHttpRequest".');
        }

        if (!_.isObject(headers)) {
            headers = {};
        }

        var DEFAULTS = {};

        headers = Object.assign(DEFAULTS, headers);

        for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        return xhr;
    };

    this._ = _;
})();