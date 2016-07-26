(function () {

    var utils = {};

    utils.isFunction = function isFunction(fn) {
        return typeof fn === 'function';
    };

    utils.isObject = function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    };

    utils.noop = function noop(){};

    /**
     * [client description]
     * @param  {[type]}   options  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function client(options, callback) { 

    }

    /**
     * [setClientMethod description]
     * @param {[type]} method [description]
     */
    function setClientMethod(method) {

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


})(window);