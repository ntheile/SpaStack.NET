define(['services/logger', 'durandal/app', 'services/datacontext'], function (logger, app, datacontext) {

    //#region Internal Methods
    var title = 'Products List';
    var products = new ko.observableArray();
    var pagesize = 5;
    var firstrecord = 0;
    var totalcount = ko.observable(0);
    var isfirstpage = ko.observable(true);
    var islastpage = ko.observable(false);
    var records;

    // this code runs each time the page is visited
    function activate() {
        logger.log(title + ' View Activated', null, title, true);

        var promise1,
            promise2,
            promise3;

        promise1 = datacontext.ready().then(function () {
            promise2 = showPage();
        });
        
        // show the page when the promise is resolved
        return $.when(promise2, promise3);
       
    }

    function deactivate() {
       
    }


    function showPage() {

        var records =
            datacontext
                .onlinedb
                .Products
                    .include("Category")
                    .withInlineCount("allpages")
                    .skip(firstrecord)
                    .take(pagesize)
                    .toArray(function (records) {
                    totalcount(records.totalCount);
                    if (records.length < pagesize) { islastpage(true) } else { islastpage(false); }
                    if (firstrecord == 0) { isfirstpage(true); } else { isfirstpage(false); }
                    console.log('records');
                    console.log(records);
                    console.log('isLastPage');
                    console.log(islastpage());
                    console.log('isfirstpage');
                    console.log(isfirstpage());
                    products([]);
                    records.forEach(function (product) {
                        var koProduct = product.asKoObservable();
                        products.push(koProduct);
                    });
        });

        return records;
    }

    function nextPage() {
        firstrecord = firstrecord + pagesize;
        showPage();
    }

    function prevPage() {
        firstrecord = firstrecord - pagesize;
        if (firstrecord < 0) { firstrecord = 0; }
        showPage();
    }

    // public code that is exposed to the view model
    var vm = {
        activate: activate,
        deactivate: deactivate,
        title: title,
        datacontext: datacontext,
        products: products,
        showPage: showPage,
        nextPage: nextPage,
        prevPage: prevPage,
        isfirstpage: isfirstpage,
        islastpage: islastpage,
        totalcount: totalcount
     };

    return vm;

});


// paging http://jaydata.org/blog/release-notes#h3_55