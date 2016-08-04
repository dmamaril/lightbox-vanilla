(function () {

    var router = {};
    var routes = {};

    router.init = function lightBoxRouterInit() {

        var path, cfg, template_url;

        events.on('router', 'onhashchange', routerOnHashChange);

        path            = getLocPath();
        cfg             = routes[path] || routes['/'];
        template_url    = _.get(cfg, 'templateUrl');

        if (!_.isString(template_url)) {
            throw new Error('No route configurations found for ' + (path || '/') + '. Unable to initialize router.');
        }

        updateViews(template_url);
    };

    router.when = function routerWhen(path, config) {

        if (configIsValid(config)) {
            routes[path] = config;
        }

        return this;
    };

    router.go = function routerGo(next_route, onRouteChange) {

        var path, cfg;

        path = hashToPath(next_route);
        cfg  = _.get(routes, path);

        if (_.isUndefined(cfg)) {
            throw new Error('No route configuration found for ' + path);
        }

        // replace onhashchange event by calling local onhashchange & onRouteChangeFn
        // then resetting the onhashchange to default listener;
        events.on(

            'router',

            'onhashchange',

            function wrapOnHashChange(hash_change_event) {

                routerOnHashChange();

                if (_.isFunction(onRouteChange)) {
                    onRouteChange();
                }

                events.on('router', 'onhashchange', routerOnHashChange);
            }
        );

        window.location.hash = next_route;
    };


    /**
     * [routerOnHashChange description]
     * @param  {[type]} hash_change_event [description]
     * @return {[type]}                   [description]
     */
    function routerOnHashChange(hash_change_event) {

        var hash = getLocPath();

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
     * [hashToPath description]
     * @param  {[type]} hash [description]
     * @return {[type]}      [description]
     */
    function hashToPath(hash) {
        return '/' + hash.substr(1);
    }

    /**
     * [getLocPath description]
     * @return {[type]} [description]
     */
    function getLocPath() {
        return '/'  + window.location.hash.substr(1);
    }


    window.lb = _.set(window.lb, 'router', router);
})();