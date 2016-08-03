(function () {

    var controller = {};

    /**
     * [fetchImages description]
     *
     *  >> this needs to become its own module
     *      >> this.gapi.fetchImages(query, start_index);
     * 
     * @param  {[type]} query       [description]
     * @param  {[type]} start_index [description]
     * @return {[type]}             [description]
     */
    function fetchImages(query, start_index) {

        var uri, ctx, gapi, gallery, wrapper;

        // default start_index to 0;
        // ensure that if we're fetching more that this ALWAYS exists;
        if (_.isUndefined(start_index)) {
            start_index = 0;
        }

        if (!_.isString(query) || query === '') {
            return;
        }

        ctx     = this;
        gapi    = window.lb.gapi;
        gallery = _.getElement('#gallery-container');
        wrapper = document.createElement('div');

        wrapper.setAttribute('class', 'thumbnail-image');

        gapi.getData(query, 0, onGetResponse);

        /**
         * [onGetResponse description]
         * @param  {[type]} err    [description]
         * @param  {[type]} images [description]
         * @return {[type]}        [description]
         */
        function onGetResponse(err, images) {

            if (err) {
                // parse err based on status code and update view;
                return;
            }

            _.each(images, appendImage);

            if (ctx.load_visible === false) {
                displayLoadButton();
            }

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
                el.setAttribute('lb-src', parent_src);

                clone = wrapper.cloneNode();

                // append all at once instead of over and over again;
                clone.appendChild(el);
                gallery.appendChild(clone);
            }

            /**
             * [displayLoadButton description]
             * @return {[type]} [description]
             */
            function displayLoadButton() {

                ctx.load_visible    = true;
                var load_btn        = _.getElement('#load-btn');

                load_btn.setAttribute('style', 'display: block');
            }
        }
    }

    controller = {
        // both should be private;
        // only methods should be exposed if it makes sense
        modal_visible   : false,
        load_visible    : false,

        load: function () {
            console.log('yaaaaazzz');
        },

        search: function () {

            var key, query;

            key = window.event.which || window.event.keyCode;

            if (key === 13) {

                // input.value === '' if empty;
                query = search_box.value.split(' ').join('+');

                if (query === '') {
                    return; // update style maybe?
                }

                // update view;
                if (window.location.hash !== '#gallery') {
                    window.location.hash = '#gallery';
                }

                fetchImages.call(this, query);
            }
        },

        openModal: function () {

            var src, e, el, modal, img;

            e       = window.event.target;
            src     = e.getAttribute('lb-src');
            modal   = _.getElement('#modal');
            img     = _.getElement('#lb-image');

            if (_.isString(src)) {
                img.setAttribute('src', src);
                modal.setAttribute('style', 'display:block');
            }

            // set display of modal true;
            // can expect src to exist due to prefiltering on getting data;

        },

        // should clean up srcs; and stuff but odnt really need to
        closeModal: function () {
            var modal = _.getElement('#modal');
            modal.setAttribute('style', 'display:none');
        },

        // left is 37 right is 39
        navigateLightBox: function () {
            console.log(window.event);
        }
    };

    window.lb = _.set(window.lb, 'controller', controller);
})();