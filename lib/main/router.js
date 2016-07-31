(function () {

    var router = {};
    var routes = {};

    router.when = function routeProviderWhen(path, config) {

        var hash = getLocHash();

        if (configIsValid(config)) {

            routes[path] = config;

            if (hash === path) {
                updateViews(config.templateUrl);
            }
        }

        return this;
    };

    window.onhashchange = onhashchange;

    /**
     * [onhashchange description]
     * @param  {[type]} hash_change_event [description]
     * @return {[type]}                   [description]
     */
    function onhashchange(hash_change_event) {

        var hash = getLocHash();

        if (routes.hasOwnProperty(hash)) {

            updateViews(routes[hash].templateUrl);

        // handle wild cards to re-route to main page;
        } else if (routes.hasOwnProperty('/')) {

            updateViews(routes['/'].templateUrl);

        } else {

            console.error('No route configuration found for ' + hash);
        }
    }

    /**
     * [updateViews description]
     *
     * >> currently just appends to body;
     * 
     * @param  {[type]} templateUrl [description]
     * @return {[type]}             [description]
     */
    function updateViews(templateUrl) {


        client.get(templateUrl, { async: false }, function onGetTemplate(err, res, body) {

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
     * [getLocHash description]
     * @return {[type]} [description]
     */
    function getLocHash() {
        return '/'  + window.location.hash.substr(1);
    }


    window.lb = _.set(window.lb, 'router', router);
})();