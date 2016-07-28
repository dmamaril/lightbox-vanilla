(function () {

    window.onload = function onWindowLoad(e) {

        routeProvider
            .when('/', {
                templateUrl : '/lib/views/main.html',
                controller  : 'MainController'
            })
            .when('/gallery', {
                templateUrl : 'lib/views/gallery.html'
            });
    };

})();