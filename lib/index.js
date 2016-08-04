(function () {

    window.onload = function onWindowLoad(e) {

        var lb = window.lb;

        lb.router
            .when('/'       , { templateUrl : '/lib/views/main.html'    })
            .when('/gallery', { templateUrl : 'lib/views/gallery.html'  });

        lb.init();
    };

})();