/**
 * router
 *
 * >> allows users to configure routes on their own
 * >> fetches templates based on templateUrl using client.js
 * >> supports callback on forced router.go to be invoked on view update
 */
(function () {

    var router = {};
    var routes = {};

    /**
     * [init description]
     *
     * >> invoked on window.onload;
     * >> register default onhashchange fn
     * >> update view based on current path or '/' by default
     * 
     * @return {undefined}
     */
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

    /**
     * [when description]
     *
     * Store routes by path later to be fetched on "onhsahchange" or on state.go
     *
     * config = {
     *     templateUrl: String
     * }
     * 
     * @param  {String} path   User defined route
     * @param  {Object} config Expect { templateUrl: String }
     * @return {Object} router
     */
    router.when = function routerWhen(path, config) {

        if (configIsValid(config)) {
            routes[path] = config;
        }

        return this;
    };

    /**
     * [go description]
     *
     * allow users to force route changes and pass an optional onRouteChange cb upon completion
     * 
     * @param  {String}     next_route    User defined route
     * @param  {Function}   onRouteChange Callback on route change complete
     * @return {undefined}
     */
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

                router.onRouteChange = onRouteChange;
                routerOnHashChange();

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
        }

        else if (routes.hasOwnProperty('/')) {
            updateViews(routes['/'].templateUrl);
        }

        else {
            throw new Error('No route configuration found for ' + hash);
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

        client.get(templateUrl, function onGetTemplate(err, html_string) {

            if (_.isString(html_string)) {
                document.body.innerHTML = html_string;                
            }

            if (_.isFunction(router.onRouteChange)) {
                router.onRouteChange()
                router.onRouteChange = null;
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