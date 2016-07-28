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
            addEventListener(el);
        }

        // handle multiple classes retrieed in host obj
        if (_.isObject(el)) {
            _.each(el, addEventListener);
        }

        // helper fn
        function addEventListener(el) {
            if (_.instanceof(el, Element)) {
                el.addEventListener(event, callback);
            }
        }
    };

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

    _.noop = function noop(){};


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
            xhr[e] = transformResponse;
        });

        xhr.onload = transformResponse.bind(xhr, null);

        function transformResponse() {

            var error       = new Error();
            var response    = {};
            var body;


            try {

                body = JSON.parse(xhr.response);

            } catch (e) {

                body = xhr.response;
            }

            // handle failures;
            if (xhr.status >= 400 || xhr.status === 0) {

                error.message       = xhr.statusText || 'NETWORK_ERROR';
                error.statusCode    = xhr.status;
                error.body          = body;

                return callback(error);
            }

            response.body       = body;
            response.statusCode = xhr.status;
            response.message    = xhr.responseText;

            callback(null, response, body);
        }

        return xhr;
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