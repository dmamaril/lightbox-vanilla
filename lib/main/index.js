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

                    var gallery, container, thumbnail_srcs, img_srcs;

                    images  = body.items;
                    gallery = _.getElement('#gallery-container');

                    _.listen(gallery, 'onclick', function (e) {

                        var src;

                        e = e.target;
                        src = e.getAttribute('src');

                        if (_.isString(src)) {
                            console.log(src);
                        }
                    });


                    container = document.createElement('div');
                    container.setAttribute('class', 'thumbnail-image');

                    _.each(images, function (img, i) {

                        var thumb_src, parent_src, el, clone;

                        thumb_src   = _.get(img, 'pagemap.cse_thumbnail.0.src');
                        parent_src  = _.get(img, 'pagemap.cse_image.0.src');

                        // need to make sure that we fetch more or grids will be uneven
                        if (!_.isString(thumb_src) || !_.isString(parent_src)) {
                            return;
                        }

                        el = document.createElement('img');
                        el.setAttribute('src', thumb_src);

                        clone = container.cloneNode();

                        clone.appendChild(el);
                        gallery.appendChild(clone);
                    });
                });
                // request for goodies;
                // insert goodies in container;
            }
        });
    };

})();