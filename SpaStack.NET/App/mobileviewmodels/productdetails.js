define(['services/datacontext'], function (datacontext) {

    //#region Internal Methods
    var title = 'Products List';
    var products = new ko.observableArray([]);
    
    // for phonejs to activate view
    function activate(id) {
        products([]);
        getData(id);
    }


    function getData(id) {
        var promise = datacontext.onlinedb.Products.filter("it.Id == " + id).include("Category").toArray(function(records) {
            records.forEach(function (product) {
                var koProduct = product.asKoObservable();
                products.push(koProduct);
            });
        });
        return promise;
    }

    // public code that is exposed to the view model
    var vm = {
        activate: activate,
        title: title,
        datacontext: datacontext,
        products: products
     };

    return vm;

});
