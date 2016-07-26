(function () {

    var utils = {};

    utils.isFunction = function isFunction(fn) {
        return typeof fn === 'function';
    };

    utils.isObject = function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    };

    utils.isString = function isString(str) {
        return typeof str === 'string';
    };

    utils.instanceof = function isInstanceof(obj, instance) {
        return obj instanceof instance;
    };

    utils.isValidHttpVerb = function isValidHttpVerb(verb) {

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

    utils.noop = function noop(){};


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
    utils.setXHRListeners = function setXHRListeners(xhr, callback) {

        var xhr_events = ['onerror', 'ontimeout', 'onabort'];

        xhr_events.forEach(function (e) {
            xhr[e] = transformResponse;
        });

        xhr.onload = transformResponse.bind(xhr, null);

        function transformResponse() {

            var error       = new Error();
            var response    = {};

            // handle failures;
            if (xhr.status >= 400 || xhr.status === 0) {

                error.message       = xhr.statusText || 'NETWORK_ERROR';
                error.statusCode    = xhr.status;

                try {

                    error.body = JSON.parse(xhr.response);

                } catch (e) {

                    error.body = xhr.response;
                }

                return callback(error);
            }

            response.statusCode = xhr.status;
            response.message    = xhr.responseText;

            try {

                response.body = JSON.parse(xhr.response);

            } catch (e) {

                response.body = xhr.response;
            }


            callback(null, response);
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
    utils.setXHRHeaders  = function setXHRHeaders(xhr, headers) {

        if (!utils.instanceof(xhr, XMLHttpRequest)) {
            throw new Error('Expected "xhr" to be instance of "XMLHttpRequest".');
        }

        if (!utils.isObject(headers)) {
            headers = {};
        }

        var DEFAULTS = {};

        headers = Object.assign(DEFAULTS, headers);

        for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        return xhr;
    };

    /**
     * [client description]
     *
     * >> validate options
     * >> create xhr client
     *     >> open based on method && uri
     *     >> set listener onload, onerror, onabort
     *     >> set max timeout
     * 
     * @param  {[type]}   options  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function client(options, callback) { 

        if (!utils.isObject(options)) {
            throw new Error('Expected "options" to be type "Object". Instead received ' + options === null ? null : typeof options);
        }

        var uri     = options.uri;
        var method  = options.method;

        if (!utils.isString(uri)) {
            throw new Error('Expected "uri" to be type "String." Instead received ' + typeof uri);
        }

        if (!utils.isString(method)) {
            throw new Error('Expected "method" to be type "String." Instead received ' + typeof method);
        }

        if (!utils.isValidHttpVerb(method)) {
            throw new Error('Expected "method" to be either ["GET", "PUT", "PATCH", "POST", "DELETE"]. Instead received ' + method);
        }

        options.method = options.method.toUpperCase();
        request(options, callback);
    }

    /**
     * [request description]
     *
     * XMLHttpRequest.setRequestHeader() :: must call setRequestHeader()after open(), but before send().
     *
     * 
     * @param  {[type]}   options  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function request(options, callback) {

        var TIMEOUT = 1000 * 10;
        var xhr     = new XMLHttpRequest();

        xhr.timeout         = options.timeout || TIMEOUT;
        xhr.withCredentials = true;

        xhr.open(options.method, options.uri);

        utils.setXHRListeners(xhr, callback);
        utils.setXHRHeaders(xhr, options.headers);

        xhr.send();
    }


    /**
     * [setClientMethod description]
     * @param {[type]} method [description]
     */
    function setClientMethod(method) {

        /**
         * [onClientRequest description]
         *
         * >> set safe defaults for args based on type expectation [done]
         * >> throw if uri isn't as expected [done]
         * >> set noop as default cb [done]
         * 
         * @param  {[type]}   uri      [description]
         * @param  {[type]}   options  [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        return function onClientRequest(uri, options, callback) {

            if (!utils.isObject(options)) {
                callback = options;
                options  = {};
            }

            if (!utils.isFunction(callback)) {
                callback = utils.noop;
            }

            if (!utils.isString(uri)) {
                throw new Error('Expected "uri" to be type "String." Instead received ' + typeof uri);
            }

            options.uri     = uri;
            options.method  = method.toUpperCase();
            client(options, callback);
        };
    }

    client.get      = setClientMethod('get'); 
    client.put      = setClientMethod('put'); 
    client.post     = setClientMethod('post');
    client.patch    = setClientMethod('patch');
    client.delete   = setClientMethod('delete');

    window.client   = client;
})();