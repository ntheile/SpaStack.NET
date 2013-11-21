﻿define([
    'durandal/system',
    'services/db',
    'services/logger'],
    function (system, db, logger) {
       
        // Database Instances
        var onlinedb = new Default.Container({
            name: 'oData',
            oDataServiceHost: '/odata'
        });

        var offlinedb = new Default.Container({
            name: 'local',
            databaseName: 'MyDb'
        });

        
        // return a promise when all the database instances are ready
        var ready = function () {
            return $.when(offlinedb.onReady(), onlinedb.onReady()).then(function () {
                toastr.info('database instances ready');
            });
        };

   
        

        var primeData = function () {
            // TODO - prime data that is shared by views

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