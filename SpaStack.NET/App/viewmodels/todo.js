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
        datacontext.offlinedb
            .TodoItem
            .filter("it.InSync == false")
            .toArray(function (todoItems) {
                datacontext.onlinedb.addMany(todoItems);
                datacontext.onlinedb.saveChanges(function () {
                    todoItems.forEach(function (todoItem) {
                        datacontext.offlinedb.attach(todoItem);
                        todoItem.InSync = true;
                    });
                    datacontext.offlinedb.saveChanges(function () {
                        listLocalTodoItems();
                        listRemoteTodoItems();
                    });
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