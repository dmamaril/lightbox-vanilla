(function () {

    var gapi, HOST_URI, API_KEY, BASE_URI;

    HOST_URI    = 'https://www.googleapis.com/customsearch/v1?imgType=photo&fields=items&';
    API_KEY     = '';

    gapi = {
        cache   : {},
        base_uri: HOST_URI + API_KEY
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

            var uri = base_uri + '&q=' + query + '&startIndex=' + start_index;

            return _.partial(client.get, uri);
        });

        _.asyncParallel(parallel_fns, function onParallelComplete(err, results) {

            if (err) {
                return done(err);
            }

            results = _.reduce(results, function (mem, res) {
                // validate it was a 200 for concatenating res.body.items;
                if (res.statusCode !== 200) {
                    return mem;
                }

                var results = _.get(res, 'body.items', []);
                return mem.concat(results);
            }, []);

            done(null, results);
        });
    };

    window.lb = _.set(window.lb, 'gapi', gapi);
})();