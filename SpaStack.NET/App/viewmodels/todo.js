define(['services/logger', 'durandal/app', 'services/datacontext'], function (logger, app, datacontext) {

    //#region Internal Methods
    var title = 'Todo List';
    var remoteTodos = new ko.observableArray();
    var localTodos = new ko.observableArray();
    var taskInput = new ko.observable();
    
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

  
    function listLocalTodoItems() {
 
        datacontext.offlinedb.TodoItem.toArray(localTodos);

    }

    function listRemoteTodoItems() {

        var promise = datacontext.onlinedb.TodoItem.toArray(remoteTodos);

        return promise;
    }

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

        var getDirtyItemsPromise = datacontext.offlinedb
                        .TodoItem
                        .filter("it.InSync == false").toArray();
         
        getDirtyItemsPromise.done(function (dirtyItems) {

            console.log("dirty");
            console.log(dirtyItems);

            //add the dirty item to the online db
            datacontext.onlinedb.addMany(dirtyItems);

            // save dirty items to server
            toastr.info('saving... dirty items to server');
            var dirtySavePromise = datacontext.onlinedb.saveChanges().then(syncRemoteChangedToLocal(dirtyItems));

            function syncRemoteChangedToLocal(dirtyItems) {

                toastr.info('syncRemoteChangedToLocal');

                // set them as InSync on offline db
                dirtyItems.forEach(function (todoItem) {
                    datacontext.offlinedb.attach(todoItem);
                    todoItem.InSync = true;
                });

                // save and reload
                datacontext.offlinedb.saveChanges().then(function () {
                    toastr.info('saved offline synd data');
                
                    // update localTodos
                    datacontext.offlinedb.TodoItem.toArray(localTodos);
                    //update remote Todos
                    datacontext.onlinedb.TodoItem.toArray(remoteTodos);

                });
            }

        });

        

    }


    function selectedTodo(data, event) {
        console.log('todo selected');
        console.log(data.Id());
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
        selectedTodo: selectedTodo
    };

    return vm;

   
});



//todo
// 1. follow this tut more closely for jaydata and ko http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
//        implement edits and saves with this
//        http://jaydata.org/blog/how-to-use-jaydata-with-knockoutjs
// 2. when sync is clicked have it update the localTodos and remoteTodos more eleganlty the ko way
// 3. promise on save returned