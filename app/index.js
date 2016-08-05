(function () {

    window.onload = function onWindowLoad(e) {

        lb.router
            .when('/'       , { templateUrl : 'app/views/main.html'     })
            .when('/gallery', { templateUrl : 'app/views/gallery.html'  });

        lb.init();
    };

})();