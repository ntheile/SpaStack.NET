define(['services/logger', 'services/datacontext'], function (logger, datacontext) {

    //#region Private Variables

   

    //#endregion




    //#region Private Methods

    function activate() {
        
        return true;
    }

    function attached() {
        $("table").tablesorter({ debug: true });
    }

    //#endregion 




    //#region Public

    // public variables exposed to the view
    var vm = {
        activate: activate,
        attached: attached
    };

    //#endregion

    return vm;
});