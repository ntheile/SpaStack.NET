define(['services/logger', 'durandal/app'], function (logger, app) {

    //#region Internal Methods
    var title = 'bootstrap-elements';
   

    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }

    //#endregion


    var vm = {
        activate: activate,
        title: title
        
    };

    return vm;

   
});