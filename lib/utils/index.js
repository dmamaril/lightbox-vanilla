(function () {

    var _ = {};

    _.isFunction = function isFunction(fn) {
        return typeof fn === 'function';
    };

    _.isUndefined = function isUndefined(el) {
        return el === undefined;
    };

    _.isObject = function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    };

    _.isString = function isString(str) {
        return typeof str === 'string';
    };

    _.instanceof = function isInstanceof(obj, instance) {
        return obj instanceof instance;
    };

    _.isArray = function isArray(arr) {
        return Array.isArray(arr);
    };

    _.isNumber = function isNumber(num) {
        return typeof num === 'number' && !isNaN(num);
    };

    _.noop = function noop(){};

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

    _.reduce = function reduce(collection, iterator, memo) {

        _.each(collection, function (val, key, collection) {
            memo = iterator(memo, val, key, collection);
        });

        return memo;
    };

    _.get = function get(obj, path, fallback) {

        var paths, current_path;

        if (!_.isObject(obj)) return fallback;

        if (_.isString(path)) {
            paths = path.split('.');
        }

        var memo = obj;

        for (var i = 0 ; i < paths.length ; i++) {

            current_path = paths[i];

            if (!memo.hasOwnProperty(current_path)) {
                return fallback;
            }

            memo = memo[current_path];
        }

        return memo;
    };


    // ELEMENT HELPERS ===========
    _.getElement = function getElement(el) {

        if (_.instanceof(el, Element)) {
            return el;
        }

        if (!_.isString(el)) {
            return null;
        }

        var selector    = el[0];
        el              = el.substr(1);

        if (selector === '.') {
            return document.getElementsByClassName(el);
        }

        if (selector === '#') {
            return document.getElementById(el);
        }
    };

    // can pass _.listen('.yo', 'click', doStuff);
    _.listen = function listen(el, event, callback) {

        if (_.isString(el)) {
            el = _.getElement(el);
        }

        if (_.instanceof(el, Element)) {
            return assignListener(el);
        }

        // handle multiple classes retrieed in host obj
        if (_.isObject(el)) {
            _.each(el, assignListener);
        }

        // helper fn
        function assignListener(el) {
            el[event] = callback;
        }
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
            throw new Error('Expected first argument to be of type "array". Instead received + ' typeof fns);
        }

        var len, n_completed, i, fn, ctx, has_resolved, results;

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
                done();
            }
        }
    }


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

        if (!_.instanceof(xhr, XMLHttpRequest)) {
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