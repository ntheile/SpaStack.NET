(function($, DX, undefined) {
    var HAS_NAVBAR_CLASS = "has-navbar",
        HAS_TOOLBAR_CLASS = "has-toolbar",
        HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_ACTIVE_CLASS = "dx-appbar-active",
        SEMI_HIDDEN_CLASS = "semi-hidden",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom.win8",
        ACTIVE_PIVOT_ITEM_SELECTOR = ".dx-pivot-item:not(.dx-pivot-item-hidden)",
        LAYOUT_FOOTER_SELECTOR = ".layout-footer",
        ACTIVE_TOOLBAR_SELECTOR = ".dx-active-view .dx-toolbar";
    DX.framework.html.NavBarController = DX.framework.html.DefaultLayoutController.inherit({
        _getLayoutTemplateName: function() {
            return "navbar"
        },
        _createNavigation: function(navigationCommands) {
            this.callBase(navigationCommands);
            var $navbar = this._$mainLayout.find(".navbar-container");
            if ($navbar.length && navigationCommands) {
                var container = $navbar.dxCommandContainer("instance");
                this._commandManager._arrangeCommandsToContainers(navigationCommands, [container]);
                this._$mainLayout.addClass(HAS_NAVBAR_CLASS)
            }
        },
        _showViewImpl: function(viewInfo) {
            var self = this;
            return self.callBase.apply(self, arguments).done(function() {
                    var $toolbar = self._$mainLayout.find(LAYOUT_FOOTER_SELECTOR).find(ACTIVE_TOOLBAR_SELECTOR),
                        isToolbarEmpty = !$toolbar.length || !$toolbar.dxToolbar("instance").option("visible");
                    self._$mainLayout.toggleClass(HAS_TOOLBAR_CLASS, !isToolbarEmpty)
                })
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "ios",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "android",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "tizen",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "navbar",
        platform: "generic",
        controller: new DX.framework.html.NavBarController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "split",
        platform: "win8",
        phone: false,
        root: true,
        controller: new DX.framework.html.NavBarController
    })
})(jQuery, DevExpress);