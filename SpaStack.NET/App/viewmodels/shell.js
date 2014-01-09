define(['durandal/system', 'plugins/router', 'services/logger', 'durandal/app', 'services/datacontext'],
    function (system, router, logger, app, datacontext) {
 
        
        //#region Private Variables
        
        var token = ko.observable(false); // Oauth Access Token
        var userName = ko.observable(false);
        var useAuth = true;
        var logout = ko.observable(false);
        var appName = "SpaStack.NET";

        //#endregion



        
        //#region Private Methods

        function activate() {
            
            if (useAuth) {
                return auth().then(boot);
            }
            else {
                return boot();
            }

        }

        function boot() {
            log('App Loaded!', null, true);

            //#region Router
            var routes = [
                    { route: '', moduleId: 'blank', title: 'Blank', visible: false, icon: '' },
                    { route: 'blank', moduleId: 'blank', title: 'Blank', visible: true, icon: 'fa fa-file' },
                    { route: 'bootstrap-elements', moduleId: 'bootstrap-elements', title: 'Bootstrap Elements', visible: true, icon: 'fa fa-desktop' },
                    { route: 'todo', moduleId: 'todo', title: 'Offline Sync', visible: true, icon: 'fa fa-list-ol' },
                    { route: 'home', moduleId: 'home', title: 'Home', visible: true, icon: 'fa fa-home' },
                    { route: 'details', moduleId: 'details', title: 'Texty', visible: true, icon: 'fa fa-search' },
                    { route: 'details/:id', moduleId: 'details', title: 'Details/id', visible: false, icon: '' },
                    { route: 'products', moduleId: 'products', title: 'OData Paging', visible: true, icon: 'fa fa-shopping-cart' },
                    { route: 'bootstrap-grid', moduleId: 'bootstrap-grid', title: 'Bootstrap Grid', visible: true, icon: 'fa fa fa-wrench' },
                    { route: 'chart', moduleId: 'chart', title: 'Charts', visible: true, icon: 'fa fa-bar-chart-o' },
                    { route: 'forms', moduleId: 'forms', title: 'Forms', visible: true, icon: 'fa fa-edit' },
                    { route: 'tables', moduleId: 'tables', title: 'Tables', visible: true, icon: 'fa fa-table' },
                    { route: 'typography', moduleId: 'typography', title: 'Typography', visible: true, icon: 'fa fa-font' }
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
                console.log('in auth');
                if (!userName() && token()) {

                    var ajaxConfig = {
                        url: 'api/Account/UserInfo',
                        type: 'GET',
                        headers: { 'Authorization': 'Bearer ' + token() }
                    };
                    function success(data) {
                        userName(data.userName);
                    }
                    return $.ajax(ajaxConfig).then(success);

                }
                else {
                    return new $.Deferred().resolve();
                }
            };

            logout(function() {
                var ajaxConfig = {
                    url: 'api/Account/Logout',
                    type: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token() }
                };

                function success(data) {
                    window.location.replace('/index.html');
                }

                return $.ajax(ajaxConfig).then(success);
            });

            return getUserInfo();
 
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion Internal Methods




        //#region Public

        var shell = {
            activate: activate,
            router: router,
            token: token,
            userName: userName,
            logout: logout,
            appName: appName
        };

        //#endregion

        return shell;
    });