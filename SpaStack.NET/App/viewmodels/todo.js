
define(['services/logger', 'durandal/app', 'services/datacontext', 'viewmodels/shell'], function (logger, app, datacontext, shell) {

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
        localTodos([]);
        return datacontext.offlinedb.TodoItems.toArray(localTodos);
    }

    function listRemoteTodoItems() {

        remoteTodos([]);

        var promise = datacontext.onlinedb.TodoItems.toArray(function (todos) {
            todos.forEach(function (todo) {
                var koTodo = todo.asKoObservable();
                // you can manipulate the observable koTodo here if you wish
                // to subscribe to events of change values
                remoteTodos.push(koTodo);

            });
        });
            
        return promise;
    }

    // add a todo item
    function submitForm(evt) {

        // create new jaydata Todo instance
        var todoInstance = new SpaStack.NET.Models.TodoItem({
            'Id': $data.createGuid(),
            'Task': taskInput(),
            'Completed': true,
            'InSync': false
        });

       
        // add new item to observable
        localTodos.push(todoInstance);
 
        // add item to offline fb
        datacontext.offlinedb.TodoItems.add(todoInstance);

        // save offline db
        datacontext.offlinedb.saveChanges();
       
        return false;

    }

   
    function synchronizeData() {

        var dirtyTodo;

        var getDirtyItemsPromise = datacontext.offlinedb
                                              .TodoItems
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
                   .TodoItems
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


    function writeValues() {
        console.log("Writing Observables");
        console.log(ko.toJS(remoteTodos));
        console.log(ko.toJS(localTodos));
    }


    //#endregion


    // public code that is exposed to the view model
    var vm = {
        activate: activate,
        deactivate: deactivate,
        title: title,
        shell: shell,
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



// links
// *  http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
// *  http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs and http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs

// TODO
// * Add offline js to detect when offline to online event happen to fire the sync method

