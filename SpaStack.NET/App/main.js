// Maps the files so Durandal knows where to find these.
require.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

// Durandal 2.x assumes no global libraries. It will ship expecting 
// Knockout and jQuery to be defined with requirejs. .NET 
// templates by default will set them up as standard script
// libs and then register them with require as follows: 
define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'plugins/router', 'services/logger'], boot);

function boot (app, viewLocator, system, router, logger) {

    var bindings = require(['services/binding-handlers']);

    // Enable debug message to show in the console 
    system.debug(true);  
    app.title = 'Hot Towel Mobile';
   
    app.configurePlugins({
        router: true
    });


    function start() {
        app.start().then(function () {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.options.backgroundpositionClass = 'toast-bottom-right';
            toastr.info('Platform: ' + app.platform + ', lastPage: ' + app.lastPage);

            // When finding a viewmodel module, replace the viewmodel string 
            // with view to find it partner view.
            // [viewmodel]s/sessions --> [view]s/sessions.html
            // Defaults to viewmodels/views/views. 
            // Otherwise you can pass paths for modules, views, partials
            viewLocator.useConvention();

            //Show the app by setting the root view model for our application, if
            // it has not already been initialized. This is benifitial for mobile tombstoneing so 
            // when you re-open an app the last state/page is persisted.
            if (app.lastPage) {
                // do nothing, the last page you visited will be shown
            }
            else {
                app.setRoot('viewmodels/shell', 'entrance');
            }

        });
    }

    ///
    /// Enable phonegap for mobile build, of set to false for web builds
    /// 
    app.usePhonegap = false;
    
    if (app.usePhonegap) {
            
        // Wait for Phonegap device API libraries to load
        //
        document.addEventListener("deviceready", function () {
            app.platform = device.platform;
            start();
        }, false);
            
    }
    else {
        app.platform = "web";
        start();
    }

    console.log(app);
    
}