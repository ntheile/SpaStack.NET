define(['services/logger', 'durandal/composition', 'durandal/app'], function (logger, composition, app) {

    //#region Internal Methods
    var title = 'Details';

    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }

    function deactivate() {
        app.lastPage = title;
        toastr.info("lastPage:" + app.lastPage);
    }

    //#endregion


    var vm = {
        activate: activate,
        title: title,
        deactivate: deactivate,
        composition: composition
    };

    return vm;

});