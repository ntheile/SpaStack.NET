(function($, DX, undefined) {
    var translator = DX.translator,
        fx = DX.fx,
        VIEW_OFFSET = 40,
        NAVIGATION_MAX_WIDTH = 300,
        NAVIGATION_TOGGLE_DURATION = 400;
    DX.framework.html.SlideOutController = DX.framework.html.DefaultLayoutController.inherit({
        _getLayoutTemplateName: function() {
            return "slideout"
        },
        _createNavigation: function(navigationCommands) {
            var self = this;
            this.callBase(navigationCommands);
            this.$slideOut = $("<div/>").appendTo(this._$hiddenBag).dxSlideOut({menuItemTemplate: $("#slideOutMenuItemTemplate")}).dxCommandContainer({id: 'global-navigation'});
            this.slideOut = this.$slideOut.dxSlideOut("instance");
            var container = this.$slideOut.dxCommandContainer("instance");
            this._commandManager._arrangeCommandsToContainers(navigationCommands, [container]);
            this.$slideOut.find(".dx-slideout-item-container").append(this._$mainLayout)
        },
        _getRootElement: function() {
            return this.$slideOut
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._navigatingHandler = $.proxy(this._onNavigating, this)
        },
        activate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.add(this._navigatingHandler)
        },
        deactivate: function() {
            this.callBase.apply(this, arguments);
            this._navigationManager.navigating.remove(this._navigatingHandler)
        },
        _onNavigating: function(args) {
            var self = this;
            if (this.slideOut.option("menuVisible"))
                args.navigateWhen.push(this._toggleNavigation().done(function() {
                    self._disableTransitions = true
                }))
        },
        _onViewShown: function(viewInfo) {
            this._disableTransitions = false
        },
        _isPlaceholderEmpty: function(viewInfo) {
            var $markup = viewInfo.renderResult.$markup;
            var toolbar = $markup.find(".layout-toolbar").data("dxToolbar");
            var items = toolbar.option("items");
            var backCommands = $.grep(items, function(item) {
                    return (item.behavior === "back" || item.id === "back") && item.visible === true
                });
            return !backCommands.length
        },
        _onRenderComplete: function(viewInfo) {
            var self = this;
            self._initNavigation(viewInfo.renderResult.$markup);
            if (self._isPlaceholderEmpty(viewInfo))
                self._initNavigationButton(viewInfo.renderResult.$markup);
            var $content = viewInfo.renderResult.$markup.find(".layout-content"),
                $appbar = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                appbar = $appbar.data("dxToolbar");
            if (appbar) {
                self._refreshAppbarVisibility(appbar, $content);
                appbar.optionChanged.add(function(name, value) {
                    if (name === "items")
                        self._refreshAppbarVisibility(appbar, $content)
                })
            }
        },
        _refreshAppbarVisibility: function(appbar, $content) {
            var isAppbarNotEmpty = false;
            $.each(appbar.option("items"), function(index, item) {
                if (item.visible) {
                    isAppbarNotEmpty = true;
                    return false
                }
            });
            $content.toggleClass("has-toolbar-bottom", isAppbarNotEmpty);
            appbar.option("visible", isAppbarNotEmpty)
        },
        _initNavigationButton: function($markup) {
            var self = this,
                $toolbar = $markup.find(".layout-toolbar"),
                toolbar = $toolbar.data("dxToolbar");
            var showNavButton = function($markup, $navButtonItem) {
                    $navButtonItem = $navButtonItem || $toolbar.find(".nav-button-item");
                    $navButtonItem.show();
                    $navButtonItem.find(".nav-button").data("dxButton").option("clickAction", $.proxy(self._toggleNavigation, self, $markup))
                };
            showNavButton($markup);
            toolbar.option("itemRenderedAction", function(e) {
                var data = e.itemData,
                    $element = e.itemElement;
                if (data.template === "nav-button")
                    $.proxy(showNavButton, self, $markup)()
            })
        },
        _initNavigation: function($markup) {
            this._isNavigationVisible = false
        },
        _toggleNavigation: function($markup) {
            return this.slideOut.toggleMenuVisibility()
        }
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "ios",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "android",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "tizen",
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "win8",
        phone: true,
        controller: new DX.framework.html.SlideOutController
    });
    DX.framework.html.layoutControllers.push({
        navigationType: "slideout",
        platform: "generic",
        controller: new DX.framework.html.SlideOutController
    })
})(jQuery, DevExpress);

