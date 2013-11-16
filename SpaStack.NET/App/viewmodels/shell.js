define(['durandal/system', 'plugins/router', 'services/logger', 'durandal/app'],
    function (system, router, logger, app) {
 
        //#region Internal Methods
        function activate() {

            return boot();
        }

        function boot() {
            log('Hot Towel SPA Loaded!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                { route: '', moduleId: 'todo', title: 'Todo', visible: false, icon: '' },
                { route: 'todo', moduleId: 'todo', title: 'Todo', visible: true, icon: 'icon icon-white icon-lock' },
                { route: 'home', moduleId: 'home', title: 'Home', visible: true, icon: 'icon icon-white icon-home' },
                { route: 'details', moduleId: 'details', title: 'Details', visible: true, icon: 'icon icon-white icon-arrow-right' },
                { route: 'details/:id', moduleId: 'details', title: 'Details/id', visible: false, icon: '' }
            ];


            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion

        var shell = {
            activate: activate,
            router: router
        };

        return shell;
    });