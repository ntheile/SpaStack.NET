define([], function() {
    var viewModel = {
        loadPanel: {
            visible: ko.observable(false),
            startLoading: function() {
                viewModel.loadPanel.visible(true);
                setTimeout(viewModel.loadPanel.finishLoading, 3000);
            },
            finishLoading: function() {
                viewModel.loadPanel.visible(false);
            }
        },
        popup: {
            showPopup: function() {
                var popup = $("#popup").data("dxPopup");
                popup.show();
            },
            hidePopup: function() {
                var popup = $("#popup").data("dxPopup");
                popup.hide();
            }
        },
        actionsheet: {
            showActionSheet: function() {
                var actionSheet = $("#action_sheet").data("dxActionSheet");
                actionSheet.show();
            },
            items: [
                {
                    text: "Delete",
                    clickAction: function() { alert("Delete"); },
                    type: "danger"
                },
                {
                    text: "Reply",
                    clickAction: function() { alert("Reply"); }
                },
                {
                    text: "Forward",
                    clickAction: function() { alert("Forward"); }
                },
                {
                    text: "Save Image",
                    clickAction: function() { alert("Save Image"); },
                    disabled: true
                }
            ]
        },
        toast: {
            showInfo: function() {
                var toast = $("#toast-info").data("dxToast");
                toast.show();
            },
            showError: function() {
                var toast = $("#toast-error").data("dxToast");
                toast.show();
            },
            showSuccess: function() {
                var toast = $("#toast-success").data("dxToast");
                toast.show();
            },
            showWarning: function() {
                var toast = $("#toast-warning").data("dxToast");
                toast.show();
            },
            showCustom: function() {
                var toast = $("#toast-custom").data("dxToast");
                toast.show();
            }
        },
        popover: {
            visible: ko.observable(false),
            toggle: function() {
                this.popover.visible(!this.popover.visible());
            },
            close: function() {
                this.popover.visible(false);
            },
            colors: ["Red", "Green", "Blue", "White", "Black"]
        },
        dialogs: {
            notify: function(){
                DevExpress.ui.notify("Sample message", "success", 1000);
            },
            alert: function() {
                DevExpress.ui.dialog.alert("Sample message", "Alert");
            },
            confirm: function() {
                DevExpress.ui.dialog.confirm("Sample message", "Confirm");
            },
            custom: {
                show: function() {
                    var replace = function() {
                        return "Replace";
                    };
                    var rename = function() {
                        return "Rename";
                    };
                    var customDialog = DevExpress.ui.dialog.custom({
                        title: "Item exists",
                        message: "<strong><em>The item already exists</em></strong>",
                        buttons: [
                            { text: "Replace", clickAction: replace },
                            { text: "Rename", clickAction: rename }
                        ]
                    });
                    customDialog.show().done(function(dialogResult) {
                        DevExpress.ui.notify(dialogResult, "info", 1000);
                    });
                }
            }
        }
    };
    return viewModel;
});