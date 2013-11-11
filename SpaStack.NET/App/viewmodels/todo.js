define(['services/logger', 'durandal/app', 'services/datacontext'], function (logger, app, datacontext) {

    //#region Internal Methods
    var title = 'Todo List';
    
    function activate() {
        logger.log(title + ' View Activated', null, title, true);


        datacontext.offlinedb.onReady(listLocalTodoItems);
        datacontext.onlinedb.onReady(listRemoteTodoItems);

        return false;
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
       
        datacontext.onlinedb.TodoItem.forEach(function (todoItem) {
            showTodoItem(todoItem, $('#RemoteTaskList'));
        });
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

        })

    }

    //#endregion


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