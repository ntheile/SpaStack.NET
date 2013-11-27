define(['durandal/system', 'plugins/router', 'services/logger', 'durandal/app', 'services/datacontext'],
    function (system, router, logger, app, datacontext) {
 
        //#region Internal Methods

        // Oauth Access Token
        var token = new ko.observable(false);
        var userName = new ko.observable(false);
        var useAuth = true;
        var logout = new ko.observable(false); 

        function activate() {
            
            if (useAuth) {
                return auth().then(boot);
            }
            else {
                return boot();
            }

        }

        function boot() {
            log('SpaStack Loaded!', null, true);

            //#region Router
                var routes = [
                    { route: '', moduleId: 'todo', title: 'Todo', visible: false, icon: '' },
                    { route: 'todo', moduleId: 'todo', title: 'Todo', visible: true, icon: 'icon icon-white icon-text-width' },
                    { route: 'home', moduleId: 'home', title: 'Home', visible: true, icon: 'icon icon-white icon-home' },
                    { route: 'details', moduleId: 'details', title: 'Details', visible: true, icon: 'icon icon-white icon-align-justify' },
                    { route: 'details/:id', moduleId: 'details', title: 'Details/id', visible: false, icon: '' },
                    { route: 'products', moduleId: 'products', title: 'Products', visible: true, icon: 'icon icon-white icon-shopping-cart' },
                ];

            //#endregion Router

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            

            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function auth() {
            
            var self = this;

            // helper
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            // get my token if one is passed ?token=access_token
            token(getParameterByName("token"));
            // clear the token query param
            window.history.replaceState({}, '', '/index.html');

            // you can config all ajax requests to pass OAuth Bearer token 
            // or just pass a header in for each ajax request (like below)
            //if (datacontext.token) {
            //    $.ajaxSetup({
            //        headers: { 'Authorization': 'Bearer ' + datacontext.token }
            //    });
            //};


            // get user name with token api/Account/UserInfo
            function getUserInfo() {
                console.log('in auth poopoo');
                if (!userName() && token()) {
                    
                    var ajaxConfig = {
                        url: 'api/Account/UserInfo',
                        type: 'GET',
                        headers: { 'Authorization': 'Bearer ' + token() }
                    }
                    function success(data) {
                        userName(data.userName);
                    }
                    return $.ajax(ajaxConfig).then(success);

                }
                else {
                    return new $.Deferred().resolve();
                }
            };

            logout(function () {
                var ajaxConfig = {
                    url: 'api/Account/Logout',
                    type: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token() }
                }
                function success(data) {
                    window.location.replace('/index.html');
                }
                return $.ajax(ajaxConfig).then(success);
            })

            return getUserInfo();
 
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion Internal Methods

        var shell = {
            activate: activate,
            router: router,
            token: token,
            userName: userName,
            logout: logout
        };

        return shell;
    });