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

        var search_box = _.getElement('#search_box');

        search_box.addEventListener('keypress', function (e) {

            var key = e.which || e.keyCode;

            if (key === 13) {


                var query = search_box.value.split(' ').join('+');

                if (query === '') {
                    return; // update style maybe?
                }

                if (window.location.hash !== '#gallery') {
                    window.location.hash = '#gallery';
                }

                // request for goodies;
                // insert goodies in container;
            }
        });
    };

})();