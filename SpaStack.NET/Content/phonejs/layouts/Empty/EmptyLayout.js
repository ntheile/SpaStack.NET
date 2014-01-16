(function($, DX, undefined) {
    DX.framework.html.EmptyLayoutController = DX.framework.html.DefaultLayoutController.inherit({ctor: function(options) {
            options = options || {};
            options.layoutTemplateName = "empty";
            this.callBase(options)
        }});
    DX.framework.html.layoutControllers.push({
        navigationType: "empty",
        controller: new DX.framework.html.EmptyLayoutController
    })
})(jQuery, DevExpress);