define([
    'durandal/system',
    'services/db',
    'services/logger'],
    function (system, db, logger) {
       
        // Database Instances
        var onlinedb = new MyDb({
            name: 'oData',
            oDataServiceHost: '/odata'
        });

        var offlinedb = new MyDb({
            name: 'local',
            databaseName: 'MyDb'
        });

        // return a promise when all the database instances are ready
        var ready = function () {
            return $.when(offlinedb.onReady(), onlinedb.onReady()).then(function () {
                toastr.info('database instances ready');
            });
        };

        //function synchronizeData() {
        //    offlinedb.onReady(function () {
        //        offlinedb
        //       .TodoItem
        //       .filter("it.InSync === false")
        //       .toArray(function (todoItems) {

        //           todoItems.forEach(function (todo) {
        //               onlinedb.add(todo);
        //               onlinedb.saveChanges().done(function(data){
                           
        //                    offlinedb.attach(data);
        //                    data.InSync = true;

        //                    //listLocalTodoItems();
        //                    //listRemoteTodoItems();
  
        //               });

        //           });


        //           //onlinedb.addMany(todoItems);
        //           //onlinedb.saveChanges(function () {
        //           //    todoItems.forEach(function (todoItem) {
        //           //        offlinedb.attach(todoItem);
        //           //        todoItem.InSync = true;
        //           //    });
        //           //    offlinedb.saveChanges(function () {
        //           //        //listLocalTodoItems();
        //           //        //listRemoteTodoItems();
        //           //    });
        //           //});
        //       })
        //    });
        //}

        //onlinedb.onReady(synchronizeData);
        
        

        var primeData = function () {
            //var promise = Q.all([
            //    getLookups(),
            //    getSpeakerPartials(null, true)])
            //    .then(applyValidators);

            //return promise.then(success);

            //function success() {
            //    datacontext.lookups = {
            //        rooms: getLocal('Rooms', 'name', true),
            //        tracks: getLocal('Tracks', 'name', true),
            //        timeslots: getLocal('TimeSlots', 'start', true),
            //        speakers: getLocal('Persons', orderBy.speaker, true)
            //    };
            //    log('Primed data', datacontext.lookups);
            //}

            //function applyValidators() {
            //    model.applySessionValidators(manager.metadataStore);
            //}

        };


        var datacontext = {
            primeData: primeData,
            onlinedb: onlinedb,
            offlinedb: offlinedb,
            ready: ready//,
            //synchronizeData: synchronizeData
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