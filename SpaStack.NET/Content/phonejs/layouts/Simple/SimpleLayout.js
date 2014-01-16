(function($, DX, undefined) {
    DX.framework.html.SimpleLayoutController = DX.framework.html.DefaultLayoutController.inherit({_getLayoutTemplateName: function() {
            return "simple"
        }});
    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom";
    DX.framework.html.Win8SimpleLayoutController = DX.framework.html.SimpleLayoutController.inherit({
        _showViewImpl: function(viewInfo) {
            var self = this,
                result = self.callBase.apply(self, arguments),
                $frame = self._getViewFrame(),
                $appbar = $frame.find(TOOLBAR_BOTTOM_SELECTOR);
            $appbar.each(function(i, element) {
                var $element = $(element);
                appbar = $element.dxToolbar("instance");
                if (appbar) {
                    self._refreshAppbarVisibility(appbar, $frame);
                    appbar.optionChanged.add(function(optionName, optionValue) {
                        if (optionName === "items")
                            self._refreshAppbarVisibility(appbar, $frame)
                    })
                }
            });
            return result
        },
        _refreshAppbarVisibility: function(appbar, $content) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $content.toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "win8",
        root: false,
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "android",
        root: false,
        controller: new DX.framework.html.SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "simple",
        platform: "ios",
        controller: new DX.framework.html.SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "simple",
        platform: "android",
        controller: new DX.framework.html.SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "simple",
        platform: "tizen",
        controller: new DX.framework.html.SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "simple",
        platform: "generic",
        controller: new DX.framework.html.SimpleLayoutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "simple",
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.Win8SimpleLayoutController
    })
})(jQuery, DevExpress);