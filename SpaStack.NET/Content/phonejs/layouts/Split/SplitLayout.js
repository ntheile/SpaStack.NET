(function($, DX, undefined) {
    var APPBAR_TOUCH_AREA_HEIGHT = 50,
        APPBAR_TOUCH_THRESHOLD = 50,
        EVENTS_NAMESPACE = ".dxSplitLayout",
        KEYCODE_WIN = 91,
        KEYCODE_Z = 90;
    DX.framework.html.SplitLayoutController = DX.framework.html.DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.disableViewLoadingState = true;
            this.callBase(options);
            this._eventHelper = new SplitLayoutEventHelper(this)
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._eventHelper.init()
        },
        _getLayoutTemplateName: function() {
            return "split"
        },
        _createNavigation: function(navigationCommands) {
            this.callBase(navigationCommands);
            var $toolbar = this._$mainLayout.find(".footer-toolbar");
            this._footerToolbar = $toolbar.dxToolbar().dxToolbar("instance");
            this._appbarCommandContainer = $toolbar.dxCommandContainer({id: 'win8-appbar'}).dxCommandContainer("instance")
        },
        _changeView: function(viewInfo) {
            var self = this;
            self.callBase(viewInfo);
            self._footerToolbar.option("items", []);
            $.each(self._visibleViews, function(target, viewInfo) {
                if (viewInfo.commands)
                    self._commandManager._arrangeCommandsToContainers(viewInfo.commands, [self._appbarCommandContainer])
            });
            self._$mainLayout.toggleClass("has-navigation", "navigation" in self._visibleViews)
        },
        _getTargetFrame: function(viewInfo) {
            return (viewInfo.viewTemplateInfo || {}).targetFrame || (viewInfo.routeData || {}).placeholder || this.callBase(viewInfo)
        },
        _prepareViewTemplate: function($viewTemplate, viewInfo) {
            this.callBase($viewTemplate, viewInfo);
            $viewTemplate.find(".dx-content-content").dxContent({targetPlaceholder: this._getTargetFrame(viewInfo)})
        },
        _renderView: function($viewTemplate, viewInfo) {
            var self = this;
            if (!self._backCommand && this._navigationManager.canBack()) {
                var previousUri = this._navigationManager.getPreviousItem().uri;
                self._backCommand = self._backCommand || new DX.framework.dxCommand({
                    title: DX.localization.localizeString("@Back"),
                    id: "previousPage",
                    type: "back",
                    action: function() {
                        self._navigationManager.navigate(previousUri, {root: true})
                    }
                })
            }
            if (self._backCommand)
                viewInfo.commands.push(self._backCommand);
            this.callBase($viewTemplate, viewInfo);
            var $markup = viewInfo.renderResult.$markup;
            $.each($markup.find(".dx-content-placeholder-content,.dx-content-placeholder-navigation"), function(index, el) {
                var $contentPlaceholder = $(el);
                if (!$contentPlaceholder.children(".dx-content").length)
                    $contentPlaceholder.remove()
            })
        },
        _appBarHasCommands: function() {
            var footerToolbar = this._$viewPort.find(".footer-toolbar").data("dxToolbar");
            return footerToolbar ? footerToolbar.option("items").length : false
        }
    });
    var SplitLayoutEventHelper = DX.Class.inherit({
            ctor: function(splitLayout) {
                this.root = splitLayout
            },
            init: function() {
                this.root._$viewPort.on("MSPointerUp" + EVENTS_NAMESPACE, $.proxy(this._handlePointerUp, this));
                this.root._$viewPort.on("MSPointerDown" + EVENTS_NAMESPACE, $.proxy(this._handlePointerDown, this));
                $(document).on("keydown" + EVENTS_NAMESPACE, $.proxy(this._handleKeyDown, this));
                $(document).on("keyup" + EVENTS_NAMESPACE, $.proxy(this._handleKeyUp, this));
                this._startTouchPoint = false;
                this._winKeyPressed = false;
                this._moveEvent = false;
                this._appbarBehavior = true
            },
            _handlePointerDown: function(e) {
                var originalEvent = e.originalEvent;
                if (this._isTouch(originalEvent) && this._startedInAppBarArea(originalEvent)) {
                    this._startTouchPoint = {
                        x: originalEvent.clientX,
                        y: originalEvent.clientY
                    };
                    this.root._$viewPort.on("MSPointerMove" + EVENTS_NAMESPACE, $.proxy(this._handlePointerMove, this))
                }
            },
            _handlePointerMove: function(e) {
                var originalEvent = e.originalEvent;
                if (this._tresholdExceeded(originalEvent)) {
                    this._moveEvent = true;
                    this.root._$viewPort.off("MSPointerMove" + EVENTS_NAMESPACE);
                    if (this._isVericalDirection(originalEvent.clientX, originalEvent.clientY))
                        this._toggleAppBarState(true)
                }
            },
            _handlePointerUp: function(e) {
                this.root._$viewPort.off("MSPointerMove" + EVENTS_NAMESPACE);
                var $appBar = this.root._$viewPort.find(".dx-app-bar");
                if (e.originalEvent.button === 2)
                    this._toggleAppBarState();
                else if (!this._moveEvent && $appBar[0] && !$appBar[0].contains(e.target))
                    this._toggleAppBarState(false);
                this._moveEvent = false
            },
            _handleKeyDown: function(e) {
                if (e.keyCode === KEYCODE_WIN)
                    this._winKeyPressed = true
            },
            _handleKeyUp: function(e) {
                if (this._winKeyPressed && e.keyCode === KEYCODE_Z)
                    this._toggleAppBarState();
                else if (e.keyCode === KEYCODE_WIN)
                    this._winKeyPressed = false
            },
            _toggleAppBarState: function(state) {
                if (!this.root._appBarHasCommands())
                    return;
                this.root._$viewPort.find(".dx-app-bar").toggleClass("dx-app-bar-visible", !this._appbarBehavior || state)
            },
            _isVericalDirection: function(x, y) {
                return Math.abs(y - this._startTouchPoint.y) > Math.abs(x - this._startTouchPoint.x)
            },
            _isTouch: function(event) {
                return event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === event.MSPOINTER_TYPE_PEN
            },
            _startedInAppBarArea: function(event) {
                return this.root._$viewPort.height() - APPBAR_TOUCH_AREA_HEIGHT < event.clientY
            },
            _tresholdExceeded: function(originalEvent) {
                return originalEvent.clientY < this._startTouchPoint.y - APPBAR_TOUCH_THRESHOLD
            }
        });
    DX.framework.html.layoutControllers.push({
        navigationType: 'split',
        root: false,
        controller: new DX.framework.html.SplitLayoutController
    })
})(jQuery, DevExpress);