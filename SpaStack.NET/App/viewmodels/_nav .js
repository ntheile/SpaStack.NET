define(['services/logger', 'services/datacontext', 'viewmodels/shell'], function (logger, datacontext, shell) {

    //#region Private Variables

    var observable = ko.observableArray([]);
    

    //#endregion




    //#region Private Methods

    function activate() {
        
        return true;

    }

    //#endregion 




    //#region Public

    // public variables exposed to the view
    var vm = {
        activate: activate,
        observable: observable,
        shell: shell
    };

    //#endregion

    return vm;
});
