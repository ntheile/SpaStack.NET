
define(['services/logger', 'durandal/app', 'services/datacontext'], function (logger, app, datacontext) {

    //#region Internal Methods
    var title = 'Todo List';
    var remoteTodos = new ko.observableArray();
    var localTodos = new ko.observableArray();
    var taskInput = new ko.observable();
    var selectedTodo = ko.observable(null);
    
    
    // this code runs each time the page is visited
    function activate() {
        logger.log(title + ' View Activated', null, title, true);

        var promise,
            promise1,
            promise2;


        promise1 = datacontext.ready().then(function () {
            listLocalTodoItems();   
        });

        promise2 = listRemoteTodoItems();

        promise = $.when(promise1, promise2);
        
        // show the page when the promise is returned
        // promise1 = when the datacontext is ready
        // promise 2 = when the remote todos items are returned
        return promise;
       
    }

    function deactivate() {
        app.lastPage = title;
        toastr.info("lastPage:" + app.lastPage);
    }

  
    function listLocalTodoItems() {
        
        datacontext.offlinedb.TodoItem.toArray(localTodos);
        
    }

    function listRemoteTodoItems() {

        var promise = datacontext.onlinedb.TodoItem.toArray(remoteTodos);

        return promise;
    }

    // add a todo item
    function submitForm(evt) {

        // create new Todo instance
        var todoInstance = new SpaStack.NET.Models.TodoItem({
            'Id': $data.createGuid(),
            'Task': taskInput(),
            'Completed': true,
            'InSync': false
        });

        // add new item to observable
        localTodos.push(todoInstance);
        
        // add item to offline fb
        datacontext.offlinedb.TodoItem.add(todoInstance);

        // save offline db
        datacontext.offlinedb.saveChanges();
       
        return false;

    }



    function synchronizeData() {

        var dirtyTodo;

        var getDirtyItemsPromise = datacontext.offlinedb
                                              .TodoItem
                                              .filter("it.InSync == false").toArray();

        // 0. When the dirty items are returned
        $.when(getDirtyItemsPromise).then(function (dirtyItems) {
            
            saveDirtyTodosToServer(dirtyItems)
                .then(updateRemoteTodosToLocally(dirtyItems));

        });

        // 1. SaveDirtyTodosToServer
        function saveDirtyTodosToServer(dirtyItems) {
            console.log("dirty");
            console.log(dirtyItems);

            //add the dirty item to the online db observable
            datacontext.onlinedb.addMany(dirtyItems);

            // save dirty items to server
            toastr.info('saving... dirty items to server');
            return datacontext.onlinedb.saveChanges();
        }

        // 2. UpdateRemoteTodosToLocally observables
        function updateRemoteTodosToLocally(dirtyItems) {

            // update remoteTodos Observable
            dirtyItems.forEach(function (todoItem) {
                todoItem.InSync = true;
                //remoteTodos.push(todoItem);
            });

            // update the localTodoes with InSync (not the boy band) set to true
            dirtyItems.forEach(function (todoItem) {
                datacontext.offlinedb.attach(todoItem);
                todoItem.InSync = true;
            });
            return datacontext.offlinedb.saveChanges()
                                         .then(listLocalTodoItems())
                                         .then(listRemoteTodoItems());

        }

    }


    function updateTodo() {
       
        var newTodo = selectedTodo();

        return promise = datacontext.offlinedb
                   .TodoItem
                   .filter("Id", "==", newTodo.Id).toArray()
                   .then(function (items) {
                       items.forEach(function (todoItem) {
                           datacontext.offlinedb.attach(todoItem);
                           todoItem.Task = newTodo.Task;
                           todoItem.InSync = false;
                       });
                       return datacontext.offlinedb.saveChanges().then(function () {
                           //synchronizeData();
                       });
                   });

    }

    function editTodo(oldTodo) {
        oldTodo.InSync = false;
        selectedTodo(oldTodo);
        
    }

    //#endregion


    // public code that is exposed to the view model
    var vm = {
        activate: activate,
        deactivate: deactivate,
        title: title,
        listLocalTodoItems: listLocalTodoItems,
        listRemoteTodoItems: listRemoteTodoItems,
        submitForm: submitForm,
        datacontext: datacontext,
        synchronizeData: synchronizeData,
        remoteTodos: remoteTodos,
        localTodos: localTodos,
        taskInput: taskInput,
        updateTodo: updateTodo,
        editTodo: editTodo,
        selectedTodo: selectedTodo
    };

    return vm;

   
});



// TODO
// * follow this tut more closely for jaydata and ko http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
//        implement edits and saves with this
//        http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs and http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
// * when sync is clicked have it update the localTodos and remoteTodos more eleganlty the ko way
// * Add offline js to detect when offline to online event happen to fire the sync method
// * Add offline manifest
// * add validation using jaydata + knockout validation