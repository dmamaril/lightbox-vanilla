/**
 * gapi
 *
 * >> configured 
 * >> built on top of client.js to hit Google's custom search API;
 * >> due to gapi constraint of returning 10 items / query,
 *   >> use asyncParallel to query for 50 items per search / load
 */
(function () {

    var gapi = {
        base_uri: 'https://www.googleapis.com/customsearch/v1?imgType=photo&fields=items'
    };

    window.lb = _.set(window.lb, 'gapi', gapi);

    /**
     * [init description]
     *
     * Retrieve gapi auth from config.json in root and set base_uri for gapi requests;
     * 
     * @return {[type]} [description]
     */
    gapi.init = function gapiInit() {

        client.get('config.json', function (err, config) {

            if (!_.isNull(err) || _.isUndefined(config.api_key) || _.isUndefined(config.cx)) {
                throw new Error('Failed to initialize gapi. Please consult README for proper app configuration.');
            }

            gapi.base_uri += '&key=' + config.api_key + '&cx=' + config.cx;
        });

    };

    /**
     * [toQueryString description]
     *
     * >> handles special character searches;
     * 
     * @param  {String} query user defined query for gapi.getData later;
     * @return {String}       encoded & padded with '+' to separate terms
     */
    gapi.toQueryString = function toQueryString(query) {

        if (!_.isString(query)) {
            return '';
        }

        query = query.split(' ');
        query = _.map(query, encodeURIComponent);

        return query.join('+');
    };

    /**
     * [decodeQueryString description]
     * @param  {String} encoded_str Encoded string by gapi.toQueryString
     * @return {String}             decoded & replaced '+' with spaces;
     */
    gapi.decodeQueryString = function decodeQueryString(encoded_str) {

        if (!_.isString(encoded_str)) {
            return '';
        }

        return decodeURIComponent(encoded_str).split('+').join(' ');
    };

    /**
     * [getData description]
     * 
     * where batch_num is incremented by "Load more" btn clicks
     *  && where each batch is 50 results at least
     *      >> each API search returns 10 items max;
     *
     * batch_num 0 will have start_indexes of [0, 10, 20, 30, 40];
     * batch_num 1 will have start_indexes of [50, ..., 90]
     *
     *
     * talking point:
     *   another approach is to trickle the results in;
     *
     * @param  {[type]}   query     [description]
     * @param  {[type]}   batch_num [description]
     * @param  {Function} done      [description]
     * @return {[type]}             [description]
     */
    gapi.getData = function getData(query, batch_num, done) {

        var start_indexes, parallel_fns, i, prev_batch, base_uri;

        if (!_.isFunction(done)) {
            return; //refuse to continue calls if no cb is provided;
        }

        if (!_.isString(query) || query === '') {
            return done(null, []);
        }

        if (!_.isNumber(batch_num)) {
            batch_num = 1;
        }

        base_uri        = this.base_uri;
        start_indexes   = [batch_num * 50];

        // cap to 5 batches;
        // add 10 to previous batch;
        for (i = 1 ; i < 5 ; i++) {

            prev_batch = start_indexes[i-1];
            start_indexes.push(prev_batch + 10);
        }

        // return a fn that queries for images;
        // _.asyncParallel takes in an array of Fns; this will be the input;
        parallel_fns = _.map(start_indexes, function (start_index) {

            var uri = base_uri + '&q=' + query;

            // 400 if start_index is set to 0;
            // message: invalid value;
            if (start_index !== 0) {
                uri += '&start=' + start_index
            }

            return _.partial(client.get, uri);
        });

        _.asyncParallel(parallel_fns, function onParallelComplete(err, results) {

            if (err) {
                return done(err);
            }

            results = _.reduce(results, function (mem, res) {
                var results = _.get(res, 'items', []);
                return mem.concat(results);
            }, []);

            done(null, results);
        });
    };

})();