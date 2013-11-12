define(['services/logger', 'durandal/app', 'services/datacontext'], function (logger, app, datacontext) {

    //#region Internal Methods
    var title = 'Todo List';
    
    // this code runs each time the page is visited
    function activate() {
        logger.log(title + ' View Activated', null, title, true);

        var promise,
            promise1,
            promise2;


        promise1 = datacontext.ready().then(function () {
            listLocalTodoItems();
            promise2 = listRemoteTodoItems();
        });

        promise = $.when(['promise1', 'promise2']);
        
        // show the page when the promise is returned
        // promise1 = when the datacontext is ready
        // promise 2 = when the remote todos items are returned
        return promise;
       
    }

    function deactivate() {
        app.lastPage = title;
        toastr.info("lastPage:" + app.lastPage);
    }

    function showTodoItem(todoItem, list) {
        var li = $('<li>').text(todoItem.Task);
        li.append($('<div>').text('Synchronized: ' + todoItem.InSync));
        list.append($(li));
    }


    function listLocalTodoItems() {
        $('#TaskList').empty();
        datacontext.offlinedb.TodoItem.forEach(function (todoItem) {
            showTodoItem(todoItem, $('#TaskList'));
        });
    }

    function listRemoteTodoItems() {

        $('#RemoteTaskList').empty();

        var promise = datacontext.onlinedb.TodoItem.forEach(function (todoItem) {
            showTodoItem(todoItem, $('#RemoteTaskList'));
        });
       
        //var promise = datacontext.onlinedb.TodoItem().then(function (todo) {
        //    todo.forEach(function (todoItem) {
        //        showTodoItem(todoItem, $('#RemoteTaskList'));
        //    })
        //});

        return promise;
    }

    function submitForm(evt) {
        datacontext.offlinedb.TodoItem.add({
            Id: $data.createGuid(),
            Task: $('#taskInput').val()
        });

        datacontext.offlinedb.saveChanges(function () {
            //evt.target.reset();
            listLocalTodoItems();
        });
        //prevent actual form submit
        return false;

    }



    function synchronizeData() {

        var dirtyPromise = datacontext.offlinedb
                        .TodoItem
                        .filter("it.InSync == false").toArray();
         
        dirtyPromise.done(function (dirtyItems) {

            console.log("dirty");
            console.log(dirtyItems);

            //add the dirty item to the online db
            datacontext.onlinedb.addMany(dirtyItems);

            // save dirty items to server
            var dirtySavePromise = datacontext.onlinedb.saveChanges();

            // set them as InSync on offline db
            dirtyItems.forEach(function (todoItem) {
                datacontext.offlinedb.attach(todoItem);
                todoItem.InSync = true;
            });
            // save and reload
            datacontext.offlinedb.saveChanges().then(function () {
                console.log('saved offline synd data');
                listLocalTodoItems();
                listRemoteTodoItems();
            });

        });

    }

    //#endregion


    // public code that is exposed to the view model
    var vm = {
        activate: activate,
        deactivate: deactivate,
        title: title,
        showTodoItem: showTodoItem,
        listLocalTodoItems: listLocalTodoItems,
        listRemoteTodoItems: listRemoteTodoItems,
        submitForm: submitForm,
        datacontext: datacontext,
        synchronizeData: synchronizeData
    };

    return vm;

   
});