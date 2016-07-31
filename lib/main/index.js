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

    this.lb = {

        load: function () {
            console.log('yaaaaazzz');
        },

        search: function () {

            var uri, key, query;

            key = window.event.which || window.event.keyCode;

            if (key === 13) {

                // input.value === '' if empty;
                query = search_box.value.split(' ').join('+');

                if (query === '') {
                    return; // update style maybe?
                }

                if (window.location.hash !== '#gallery') {
                    window.location.hash = '#gallery';
                }

                uri = '';
                client.get(uri, onGetResponse);

                /**
                 * [onGetResponse description]
                 * @param  {[type]} err  [description]
                 * @param  {[type]} res  [description]
                 * @param  {[type]} body [description]
                 * @return {[type]}      [description]
                 */
                function onGetResponse(err, res, body) {

                    var gallery, container;

                    images  = body.items;
                    gallery = _.getElement('#gallery-container');

                    container = document.createElement('div');
                    container.setAttribute('class', 'thumbnail-image');

                    _.each(images, appendImage);

                    /**
                     * [appendImage description]
                     * @param  {[type]} img   [description]
                     * @param  {[type]} index [description]
                     * @return {[type]}       [description]
                     */
                    function appendImage(img, index) {

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
                    }
                }
            }
        },

        openModal: function () {

            var src, e;

            e   = window.event.target;
            src = e.getAttribute('src');

            // can expect src to exist due to prefiltering on getting data;
        }
    };

})();