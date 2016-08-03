(function () {

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

        if (!_.isObject(options)) {
            throw new Error('Expected "options" to be type "Object". Instead received ' + options === null ? null : typeof options);
        }

        var uri, method;

        uri     = options.uri;
        method  = options.method;

        if (!_.isString(uri)) {
            throw new Error('Expected "uri" to be type "String." Instead received ' + typeof uri);
        }

        if (!_.isString(method)) {
            throw new Error('Expected "method" to be type "String." Instead received ' + typeof method);
        }

        if (!_.isValidHttpVerb(method)) {
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
     * Kill timeouts for sync calls
     *     note:: sync no buens consider web workers;
     *
     * 
     * @param  {[type]}   options  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function request(options, callback) {

        var xhr, TIMEOUT;

        TIMEOUT = 1000 * 10;
        xhr     = new XMLHttpRequest();

        xhr.timeout         = options.timeout || TIMEOUT;
        xhr.withCredentials = true;

        // default to true if async param is not provided;
        if (_.isUndefined(options.async)) {
            options.async = true;
        }

        if (options.async === false) {
            xhr.timeout = undefined;
        }

        callback = transformResponse(xhr, callback);

        xhr.open(options.method, options.uri, options.async);

        _.setXHRListeners(xhr, callback);
        _.setXHRHeaders(xhr, options.headers);

        xhr.send();
    }

    /**
     * [transformResponse description]
     *
     * helper fn for callback to follow api interface;
     * 
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function transformResponse(xhr, callback) {
        return function onTransformedResponse(err) {

            var error, response, body;

            response = {};
            error    = new Error();

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
    }


    /**
     * [preSetClient description]
     * @param {[type]} method [description]
     */
    function preSetClient(method) {

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

            if (!_.isObject(options)) {
                callback = options;
                options  = {};
            }

            if (!_.isFunction(callback)) {
                callback = _.noop;
            }

            if (!_.isString(uri)) {
                throw new Error('Expected "uri" to be type "String." Instead received ' + typeof uri);
            }

            options.uri     = uri;
            options.method  = method.toUpperCase();
            client(options, callback);
        };
    }

    client.get      = preSetClient('get'); 
    client.put      = preSetClient('put'); 
    client.post     = preSetClient('post');
    client.patch    = preSetClient('patch');
    client.delete   = preSetClient('delete');

    this.client   = client;
})();