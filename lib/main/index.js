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

        var search_box  = _.getElement('#search_box');

        search_box.addEventListener('keypress', function (e) {

            var uri, key;

            key = e.which || e.keyCode;

            if (key === 13) {

                // input.value === '' if empty;
                var query = search_box.value.split(' ').join('+');

                if (query === '') {
                    return; // update style maybe?
                }

                if (window.location.hash !== '#gallery') {
                    window.location.hash = '#gallery';
                }

                uri = '';

                client.get(uri, function (err, res, body) {
                    var container, thumbnail_srcs, img_srcs;
                    container = _.getElement('#thumbnail-container');
                });
                // request for goodies;
                // insert goodies in container;
            }
        });
    };

})();