//#region Config
require.config({
    urlArgs: "v=" + 1,
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});
define('jquery', function () { return jQuery; });
define('knockout', ko);
//#endregion


define([], function () {
    console.log('main mobile');

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    DevExpress.devices.current({
        phone: true,
        platform: 'ios' // android, ios, win8
    });

    var KitchenSink = {};

    //#region Slide Menu Config
    KitchenSink = $.extend(true, window.KitchenSink, {
        "config": {
            "navigationType": "slideout",
            "navigation": [
              {
                  "id": "home",
                  "title": "home",
                  "action": "#home",
                  "icon": "home"
              },
              {
                  "title": "Form",
                  "action": "#Form",
                  "icon": "todo"
              },
              {
                  "title": "Overlays",
                  "action": "#Overlays",
                  "icon": "tips"
              },
              {
                  "title": "Lists",
                  "action": "#Lists",
                  "icon": "card"
              },
              {
                  "title": "Maps",
                  "action": "#Maps",
                  "icon": "map"
              },
              {
                  "title": "Gallery",
                  "action": "#Gallery",
                  "icon": "photo"
              },
              {
                  "title": "Navigation",
                  "action": "#Navigation",
                  "icon": "arrowright"
              },
              {
                  "title": "Custom Events",
                  "action": "#CustomEvents",
                  "icon": "favorites"
              },
              {
                  "title": "Icons",
                  "action": "#IconSet",
                  "icon": "image"
              },
              {
                  "title": "Products",
                  "action": "#products",
                  "icon": "product"
              }
            ]
        }
    });

    //#endregion


    

    document.addEventListener("deviceready", onDeviceReady, false);

    KitchenSink.app = new DevExpress.framework.html.HtmlApplication({
        namespace: KitchenSink,
        navigationType: KitchenSink.config.navigationType,
        navigation: getNavigationItems()
    });

    // [add routes here...]
    KitchenSink.app.router.register(":view/:id", { view: "home", id: undefined });

    function showMenu(e) {
        KitchenSink.app.viewShown.remove(showMenu);

        if (e.viewInfo.viewName !== "Home")
            return;

        setTimeout(function () {
            $(".nav-button").trigger("dxclick");
        }, 1000);
    }

    function getNavigationItems() {
        if (DevExpress.devices.current().platform === "win8") {
            KitchenSink.config.navigation.push({
                "title": "Panorama",
                "action": "#Panorama",
                "icon": "favorites"
            },
            {
                "title": "Pivot",
                "action": "#Pivot",
                "icon": "favorites"
            });
        }
        return KitchenSink.config.navigation;
    }

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackButton, false);
    }

    function onBackButton() {
        if (KitchenSink.app.canBack()) {
            KitchenSink.app.back();
        } else {
            switch (DevExpress.devices.current().platform) {
                case "tizen":
                    tizen.application.getCurrentApplication().exit();
                    break;
                case "android":
                    navigator.app.exitApp();
                    break;
                case "win8":
                    window.external.Notify("DevExpress.ExitApp");
                    break;
            }
        }
    }

    KitchenSink.app.viewShown.add(showMenu);

    // [add all the viewmodels here..]
    require(['viewmodels/home',
             'mobileviewmodels/Form',
             'mobileviewmodels/Overlays',
             'mobileviewmodels/CustomEvents',
             'mobileviewmodels/Gallery',
             'mobileviewmodels/IconSet',
             'mobileviewmodels/Lists',
             'mobileviewmodels/Maps',
             'mobileviewmodels/Navigation',
             'mobileviewmodels/Panorama',
             'mobileviewmodels/Pivot',
             'viewmodels/products',
             'mobileviewmodels/productdetails'

    ], function (homeVm,
                 formVm,
                 overlaysVm,
                 customEventsVm,
                 galleryVm,
                 iconSetVm,
                 listsVm,
                 mapsVm,
                 navigationVm,
                 panoramaVm,
                 pivotVm,
                 productsVm,
                 productdetailsVm

    ){
        var self = {};
        self.homeVm = homeVm;
        self.formVm = formVm;
        self.overlaysVm = overlaysVm;
        self.customEventsVm = customEventsVm;
        self.galleryVm = galleryVm;
        self.iconSetVm = iconSetVm;
        self.listsVm = listsVm;
        self.mapsVm = mapsVm;
        self.navigationVm = navigationVm;
        self.panoramaVm = panoramaVm;
        self.pivotVm = pivotVm;
        self.productsVm = productsVm;
        self.productdetailsVm = productdetailsVm;

        KitchenSink.home = function (params) {
            return self.homeVm;
        };
        KitchenSink.Form = function (params) {
            return self.formVm;
        };
        KitchenSink.Overlays = function (params) {
            return self.overlaysVm;
        };
        KitchenSink.CustomEvents = function (params) {
            return self.customEventsVm;
        };
        KitchenSink.Gallery = function (params) {
            return self.galleryVm;
        };
        KitchenSink.IconSet = function (params) {
            return self.iconSetVm;
        };
        KitchenSink.Lists = function (params) {
            return self.listsVm;
        };
        KitchenSink.Maps = function (params) {
            return self.mapsVm;
        };
        KitchenSink.Navigation = function (params) {
            return self.navigationVm;
        };
        KitchenSink.Panorama = function (params) {
            return self.panoramaVm;
        };
        KitchenSink.Pivot = function (params) {
            return self.pivotVm;
        };
        KitchenSink.products = function (params) {
            return self.productsVm;
        };
        KitchenSink.productdetails = function (params) {
            // pass the query string value #/productdetails/{id}
            self.productdetailsVm.activate(params.id);
            return self.productdetailsVm;
        };

        // now navigate to the first route
        KitchenSink.app.navigate();
    });

    
        
    return KitchenSink;
});