define(['services/logger', 'viewmodels/shell'], function (logger, shell) {
    
    //#region Internal Methods
    
    function activate() {
        return true;
    }
    //#endregion

    function logout(){
        shell.logout();
    }

    var vm = {
        activate: activate,
        shell: shell
    };

    return vm;
});