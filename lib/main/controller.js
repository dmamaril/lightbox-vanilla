(function () {

    var controller, state, debouncedSearch;

    controller = {};

    state = {
        load_visible    : false,
        modal_visible   : false,
        previous_query  : null,
        image_batch     : 0
    };

    /**
     * [fetchImages description]
     * @param  {[type]} query       [description]
     * @param  {[type]} image_batch [description]
     * @return {[type]}             [description]
     */
    function fetchImages(query, image_batch) {

        var uri, gapi, gallery, wrapper, image_index, new_query;

        if (!_.isString(query) || query === '') {
            return;
        }

        gapi    = window.lb.gapi;
        wrapper = document.createElement('div');
        gallery = _.getElement('#gallery-container');

        // if image_batch is set to 0, it's a new search query;
        state.image_batch   = image_batch;
        new_query           = image_batch === 0;
        image_index         = new_query ? 0 : gallery.children.length;

        wrapper.setAttribute('class', 'thumbnail-image');
        gapi.getData(query, state.image_batch, onGetResponse);

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

            if (new_query) {
                _.deleteChildNodes(gallery);
            }

            // update state;
            state.previous_query = query;

            // hook all images to gallery;
            _.each(images, function appendImage(img) {

                var thumb_src, parent_src, el, clone;

                thumb_src   = _.get(img, 'pagemap.cse_thumbnail.0.src');
                parent_src  = _.get(img, 'pagemap.cse_image.0.src');

                // need to make sure that we fetch more or grids will be uneven
                if (!_.isString(thumb_src) || !_.isString(parent_src)) {
                    return;
                }

                el = document.createElement('img');
                el.setAttribute('src', thumb_src);
                el.setAttribute('lb-index', image_index);
                el.setAttribute('lb-src', parent_src);
                el.setAttribute('id', 'lb-index-' + image_index);

                clone = wrapper.cloneNode();

                // append all at once instead of over and over again;
                image_index++;
                clone.appendChild(el);
                gallery.appendChild(clone);
            });

            // display load more;
            if (state.load_visible === false) {
                displayLoadButton();
            }
        }

        /**
         * [displayLoadButton description]
         *
         * helper fn to toggle load btn display;
         * 
         * @return {[type]} [description]
         */
        function displayLoadButton() {

            state.load_visible  = true;
            var load_btn        = _.getElement('#load-btn');

            load_btn.setAttribute('style', 'display: block');
        }
    }


    /**
     * [clickEnter description]
     * 
     * >> on enter empty out the search box, update the view, and fetch the images
     * 
     * @return {[type]} [description]
     */
    function search(query, image_batch) {

        // update view;
        if (window.location.hash !== '#gallery') {
            window.location.hash = '#gallery';
        }

        state.image_batch = image_batch
        fetchImages(query, state.image_batch);
    }

    /**
     * [debouncedSearch description]
     * 
     * >> prevent fetching images to be called multiple times within 2 seconds
     * 
     * @type {[type]}
     */
    debouncedSearch = _.debounce(search, 2000);

    controller = {

        load: function () {
            debouncedSearch(state.previous_query, state.image_batch + 1);
        },

        search: function () {

            if (_.keyPressed(window.event) === 'enter') {

                // input.value === '' if empty;
                var query = search_box.value.split(' ').join('+');

                if (query === '') {
                    return; // update style maybe?
                }

                // refuse spammage;
                if (query === state.previous_query) {
                    return;
                }

                debouncedSearch(query, 0);
            }

        },

        openModal: function () {

            var src, el, modal, img;

            el      = window.event.target;
            src     = el.getAttribute('lb-src');
            modal   = _.getElement('#modal');
            img     = _.getElement('#lb-image');

            // set display of modal true;
            // can expect src to exist due to prefiltering on getting data;
            if (!_.isString(src)) {
                return;
            }

            img.setAttribute('src', src);
            modal.setAttribute('style', 'display:block');

            state.modal_visible = true;
            state.modal_index   = Number(el.getAttribute('lb-index'));
        },

        // should clean up srcs; and stuff but odnt really need to
        closeModal: function () {

            var modal = _.getElement('#modal');
            state.modal_visible = false;
            
            modal.setAttribute('style', 'display:none');
        },

        // left is 37 right is 39
        navigateLightBox: function () {

            if (state.modal_visible === false) {
                return;
            }

            var key, direction;

            var key = _.keyPressed(window.event);

            if (key === 'escape') {
                return this.closeModal();
            }

            if (key === 'left_arrow' || key === 'right_arrow' || key === 'enter') {
                direction = key === 'left_arrow' ? 'previous' : 'next';
                return this.loadImg(direction);
            }
        },

        loadImg: function (direction) {

            var index, next_index, next_image, modal_image, image_src;

            index       = state.modal_index;
            next_index  = direction === 'previous' ? index - 1 : index + 1;

            modal_image = _.getElement('#lb-image');
            next_image  = _.getElement('#lb-index-' + next_index);
            image_src   = next_image.getAttribute('src');

            state.modal_index = next_index;
            modal_image.setAttribute('src', image_src);
        }
    };

    window.lb = _.set(window.lb, 'controller', controller);
})();