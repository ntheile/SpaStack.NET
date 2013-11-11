define(['services/logger'], function (logger) {
    
    //#region Internal Methods
    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }
    //#endregion


    var vm = {
       activate: activate
    };

    return vm;
});