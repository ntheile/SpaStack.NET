define([
    'durandal/system',
    'services/db',
    'services/logger',
    'config'],
    function (system, db, logger, config) {

        // Database Instances
        var onlinedb = new Default.Container({
            name: 'oData',
            oDataServiceHost: config.apiUrl + '/odata'
        });

        var offlinedb = new Default.Container({
            name: 'local',
            databaseName: 'MyDb'
        });

        
        // return a promise when all the database instances are ready and the user is authorized
        // you can include a datacontext.ready().then() call in each viewmodels activate function
        var ready = function () {
            return $.when(offlinedb.onReady(), onlinedb.onReady()).then(function () {
                console.log('database instances ready, user authorized');
            });
        };

        var getTodoItems = function() {
            return datacontext.onlinedb.TodoItems.toArray();
        };

        var primeData = function () {
            // TODO - prime data that is shared by views

        };


        var datacontext = {
            primeData: primeData,
            onlinedb: onlinedb,
            offlinedb: offlinedb,
            ready: ready,
            getTodoItems: getTodoItems
        };

        
        return datacontext;


        //#region Internal methods        

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion
    });