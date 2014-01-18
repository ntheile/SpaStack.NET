define(['services/datacontext'], function (datacontext) {

    //#region Internal Methods
    var title = 'Products List';
    var product =  ko.observable();
    
    // for phonejs to activate view
    function viewShown(params) {
        getData();
    }


    function getData() {
        var promise = datacontext.onlinedb.Products.include("Category").toArray(product);
        return promise;
    }

    // public code that is exposed to the view model
    var vm = {
        viewShown: viewShown,
        title: title,
        datacontext: datacontext,
        product: product       
     };

    return vm;

});
