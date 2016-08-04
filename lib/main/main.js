(function () {

    /**
     * [init description]
     * @return {[type]} [description]
     */
    function init() {

        var modules = this.modules;

        _.each(modules, function onLightBoxInit(module) {

            if (_.isFunction(module.init)) {
                module.init();
            }

        });
    }

    window.lb = _.set(window.lb, 'init', init);
})();