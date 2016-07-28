(function () {

    var routeProvider   = {};
    var routes          = {};

    window.onhashchange = function onhashchange(hash_change_event) {

        var hash = getCurrentHash('/');

        if (routes.hasOwnProperty(hash)) {

            updateViews(routes[hash].templateUrl);

        } else if (routes.hasOwnProperty('/')) {

            updateViews(routes['/'].templateUrl);

        } else {

            console.error('No route configuration found for ' + hash);
        }
    };

    routeProvider.when = function routeProviderWhen(path, config) {

        var hash            = getCurrentHash('/');
        var isCurrentRoute  = hash === path;

        if (configIsValid(config)) {

            routes[path] = config;

            if (isCurrentRoute) {
                updateViews(config.templateUrl);
            }
        }

        return this;
    };

    /**
     * [updateViews description]
     *
     * >> currently just appends to body;
     * 
     * @param  {[type]} templateUrl [description]
     * @return {[type]}             [description]
     */
    function updateViews(templateUrl) {
        client.get(templateUrl, function onGetTemplate(err, res, body) {
            if (_.isString(body)) {
                document.body.innerHTML = body;                
            }
        });
    }

    /**
     * [configIsValid description]
     * @param  {[type]} cfg [description]
     * @return {[type]}     [description]
     */
    function configIsValid(cfg) {
        return (_.isObject(cfg) && _.isString(cfg.templateUrl)) ? true : false;
    }

    /**
     * [getCurrentHash description]
     * @param  {[type]} prefix [description]
     * @return {[type]}        [description]
     */
    function getCurrentHash(prefix) {

        if (!_.isString(prefix)) {
            prefix = '';
        }

        return prefix + window.location.hash.substr(1);
    }

    this.routeProvider = routeProvider;
})();