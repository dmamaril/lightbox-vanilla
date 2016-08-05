/**
 * controller
 *
 * >> Exposes view event bindings;
 * >> Controls search, gallery & lightbox;
 * >> Dependencies: [gapi.js, events.js]
 */
(function () {

    var controller, state, debouncedSearch;

    controller      = {};
    state           = {};

    debouncedSearch = _.debounce(startSearch, 2000);
    window.lb       = _.set(window.lb, 'controller', controller);

    /**
     * [init description]
     *
     * invoked on window.onload
     * 
     * @return {undefined}
     */
    controller.init = function init() {
        resetState();
        events.on('controller', 'onhashchange', resetState);
    };

    /**
     * [load description]
     *
     * boudn to load more button when visible; also debounced by 2s
     * >> upgrade state.image_batch;
     * 
     * @return {undefined}
     */
    controller.load = function load() {
        debouncedSearch(state.previous_query, state.image_batch + 1);
    };

    /**
     * [search description]
     *
     * on enter keypress from search input box;
     * >> NOTE: searches are dbounced by 2s
     * 
     * @return {undefined}
     */
    controller.search = function search(event) {

        if (_.keyPressed(event) === 'enter') {

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

    };

    /**
     * [openModal description]
     *
     * bound to onclick of each thumbnail image
     *     >> display larger parent source from thumbnail's "lb-src" attr
     * 
     * @return {undefined}
     */
    controller.openModal = function openModal(event) {

        var src, el, modal, img, index;

        el      = event.target;
        src     = el.getAttribute('lb-src');
        index   = Number(el.getAttribute('lb-index')); // lb-index comes back as a string;

        modal   = _.getElement('#modal');
        img     = _.getElement('#lb-image');

        img.setAttribute('src', src);
        modal.setAttribute('style', 'display:block');


        // onclick of first or last, arrows should be hidden;
        toggleNavArrows(index);


        state.modal_visible = true;
        state.modal_index   = index;
    };

    /**
     * [closeModal description]
     *
     * boudn to "x" of lightbox view
     * 
     * @return {undefined}
     */
    controller.closeModal = function closeModal() {

        var modal           = _.getElement('#modal');
        state.modal_visible = false;
        
        modal.setAttribute('style', 'display:none');
    };

    /**
     * [navigateLightBox description]
     *
     * bound to body.onkeypress to allow users to navigate lightbox view with keys
     * 
     * @return {undefined}
     */
    controller.navigateLightBox = function navigateLightBox(event) {

        if (state.modal_visible === false) {
            return;
        }

        var key, direction;

        key = _.keyPressed(event);

        if (key === 'escape') {

            this.closeModal();

        } else if (key === 'left_arrow' || key === 'right_arrow' || key === 'enter') {

            direction = key === 'left_arrow' ? 'previous' : 'next';
            loadImg(direction);
        }
    };

    controller.loadPrevImg = _.partial(loadImg, 'previous');

    controller.loadNextImg = _.partial(loadImg, 'next');

    /**
     * [hideError description]
     *
     * bound to 'onclick' of error to hide upon ack
     * 
     * @return {undefined}
     */
    controller.hideError = function hideError() {

        var error_el = _.getElement('#error');

        if (_.isElement(error_el)) {
            error_el.setAttribute('style', 'display:none');
        }
    };



    /**
     * [loadImg description]
     *
     * bound to left & right nav keys of modal
     * update modal image;
     * 
     * @param  {String} direction "previous" or "next"
     * @return {undfined}
     */
    function loadImg(direction) {

        var index, next_index, next_image, modal_image, image_src, view_percentage;

        index       = state.modal_index;
        next_index  = direction === 'previous' ? index - 1 : index + 1;

        modal_image = _.getElement('#lb-image');
        next_image  = _.getElement('#lb-index-' + next_index);

        if (_.isNull(next_image)) {
            return;
        }

        image_src       = next_image.getAttribute('lb-src');
        view_percentage = next_index / state.num_images;

        // automatically load more @ 80% of existing thumbnails;
        // spamming right should be taken care of by debounce;
        if (view_percentage > 0.75 && direction === 'next' && !state.rate_limited) {
            controller.load();
        }

        // hide / display based on new index;
        toggleNavArrows(next_index);

        state.modal_index = next_index;
        modal_image.setAttribute('src', image_src);
    };

    /**
     * [resetState description]
     * @return {[type]} [description]
     */
    function resetState() {

        state.rate_limited      = false;

        state.load_visible      = false;
        state.modal_visible     = false;

        state.next_nav_visible  = true;
        state.prev_nav_visible  = true;    

        state.previous_query    = null;
        state.image_batch       = 0;
        state.num_images        = 0;
    }

    /**
     * [startSearch description]
     *
     * >> google api only allows 100 results,
     *     therefore refuse to continue search and
     *     display appropriate error message when we're at 100
     * 
     * @param  {String}     query       User input in search box
     * @param  {Intger}     image_batch batch by 50, always 0 on new search
     * @return {undefined}
     */
    function startSearch(query, image_batch) {

        if (state.num_images >= 100) {
            return showError(400);
        }

        // update view;
        if (window.location.hash !== '#gallery') {

            window.lb.router.go('#gallery', _.partial(fetchImages, query, image_batch));

        } else {

            fetchImages(query, image_batch);
        }
    }

    /**
     * [fetchImages description]
     *
     * get and append images based on query by batches of 50;
     * 
     * @param  {String}     query       User input in search box
     * @param  {Intger}     image_batch batch by 50, always 0 on new search
     * @return {undefined}
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
        new_query           = image_batch === 0;
        image_index         = new_query ? 0 : gallery.children.length;

        // update state;
        state.image_batch   = image_batch;
        state.rate_limited  = new_query ? false : true;
        state.num_images    = new_query ? 0 : state.num_images;

        wrapper.setAttribute('class', 'thumbnail-image');

        // main fn;
        gapi.getData(query, state.image_batch, appendImages);

        /**
         * [appendImages description]
         * @param  {[type]} err    [description]
         * @param  {[type]} images [description]
         * @return {[type]}        [description]
         */
        function appendImages(err, images) {

            if (err) {
                var status_code = _.get(err, 'statusCode');
                return showError(status_code);
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
                if (!_.isString(thumb_src) && !_.isString(parent_src)) {
                    return;
                }

                el = document.createElement('img');
                el.setAttribute('lb-index'  , image_index);
                el.setAttribute('lb-src'    , parent_src || thumb_src); // deafult to either or;
                el.setAttribute('src'       , thumb_src  || parent_src); // deafult to either or;
                el.setAttribute('id'        , 'lb-index-' + image_index);
                el.setAttribute('onerror'   , 'this.src="app/styles/no_image.jpg"'); // find cooler option

                clone = wrapper.cloneNode();

                clone.appendChild(el);
                gallery.appendChild(clone);

                image_index++;
                state.num_images++;
            });

            // display if hidden && safe to load more;
            if (!state.load_visible && !state.rate_limited) {

                toggleLoadButtonDisplay('block');

            // refuse to load more if already rate limited;
            } else if (state.load_visible && state.rate_limited) {

                toggleLoadButtonDisplay('none');
            }
        }

        /**
         * [toggleLoadButtonDisplay description]
         *
         * helper fn to toggle load btn display based on values assed in
         * 
         * @return {[type]} [description]
         */
        function toggleLoadButtonDisplay(val) {

            state.load_visible  = val === 'block' ? true : false;
            var load_btn        = _.getElement('#load-btn');

            load_btn.setAttribute('style', 'display:' + val);
        }
    }

    /**
     * [showError description]
     *
     *  update subtitle 
     * 
     * @param  {Integer} status_code Client.response.statusCode
     * @return {undefined}
     */
    function showError(status_code) {

        var error, msg_subtitle;

        error           = _.getElement('#error');
        msg_subtitle    = _.getElement('#error-message-subtitle');

        error.setAttribute('style', 'display:block');

        if (status_code === 403) {

            msg_subtitle.innerHTML = 'Rate limited...';

        } else if (status_code === 400) {

            state.rate_limited = true;
            msg_subtitle.innerHTML = 'We\'re all out of goodies';

        } else {

            msg_subtitle.innerHTML = 'Something\'s gone horribly wrong.';
        }
    }

    /**
     * [toggleNavArrows description]
     *
     *  >> hide or display nav arrows based on index;
     * 
     * @param  {Integer} index Next/Prev Image Index / On click index;
     * @return {undefined}
     */
    function toggleNavArrows (index) {

        if (index === 0) {

            state.prev_nav_visible = false;
            toggleNavDisplay('#modal-nav-prev', 'none');
        }

        else if (index === state.num_images - 1) {

            state.next_nav_visible = false;
            toggleNavDisplay('#modal-nav-next', 'none');
        }

        else if (!state.prev_nav_visible) {

            state.prev_nav_visible = true;
            toggleNavDisplay('#modal-nav-prev', 'block');
        }

        else if (!state.next_nav_visible) {

            state.next_nav_visible = true;
            toggleNavDisplay('#modal-nav-next', 'block');
        }

        /**
         * [toggleNavDisplay description]
         * @param  {[type]} selector [description]
         * @param  {[type]} value    [description]
         * @return {[type]}          [description]
         */
        function toggleNavDisplay(selector, value) {

            var el = _.getElement(selector);
            el.setAttribute('style', 'display: ' + value);
        }
    }

})();