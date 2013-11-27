define(['services/logger', 'durandal/composition', 'durandal/app'], function (logger, composition, app) {

    //#region Internal Methods
    var title = 'Login';

    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }

    function deactivate() {
       
    }

    //#endregion


    var vm = {
        activate: activate,
        title: title,
        deactivate: deactivate
        
    };

    return vm;

});