(function () {

    var events  = {};
    var storage = {};

    /**
     * [on description]
     * @param  {[type]} source [description]
     * @param  {[type]} event  [description]
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    function on(source, event, action) {

        if (!_.isString(source)) {
            throw new Error('Expected "source" to be of type "String." Instead received ' + typeof source);
        }

        if (!_.isString(event)) {
            throw new Error('Expected "event" to be of type "String." Instead received ' + typeof event);
        }

        if (!_.isFunction(action)) {
            throw new Error('Expected "action" to be of type "Function." Instead received ' + typeof action);
        }

        _.set(storage, [event, source], action);
        assignGlobalEvent(event, storage[event]);
    }

    /**
     * [assignGlobalEvent description]
     * @param  {[type]} event   [description]
     * @param  {[type]} sources [description]
     * @return {[type]}         [description]
     */
    function assignGlobalEvent(event, sources) {

        var context, actions;

        context = this;
        actions = _.values(sources);

        window[event] = function eventGlobalAssignment(e) {

            var args = arguments;

            _.each(actions, function onEvent(action) {
                action.apply(context, arguments);
            });
        };
    }

    events.on   = on;
    this.events = events;
})();