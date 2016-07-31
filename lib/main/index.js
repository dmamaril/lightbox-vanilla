(function () {

    window.onload = function onWindowLoad(e) {

        var router = _.get(window.lb, 'router');

        if (_.isObject(router)) {

            router
                .when('/', {
                    templateUrl : '/lib/views/main.html',
                })
                .when('/gallery', {
                    templateUrl : 'lib/views/gallery.html'
                });
        }
    };

})();