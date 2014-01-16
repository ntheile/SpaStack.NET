define(['services/dbmobile'], function(db){
    var deleteTypes = ["toggle", "slideButton", "slideItem", "swipe", "hold"];

    var viewModel = {

        deleteTypes: deleteTypes,

        deleteType: ko.observable(deleteTypes[0]),

        tabs: [
           { text: "Simple" },
           { text: "Grouped" },
           { text: "Custom" }
        ],

        selectedTab: ko.observable(),

        simpleList: {
            dataSource: new DevExpress.data.DataSource({ store: db.products }),
            rendered: ko.observable(false)
        },

        groupedList: {
            dataSource: new DevExpress.data.DataSource({ store: db.productsGrouped }),
            rendered: ko.observable(false)
        },

        customList: {
            dataSource: new DevExpress.data.DataSource({ store: db.productsCustom }),
            rendered: ko.observable(false),
            searchQuery: ko.observable().extend({ throttle: 500 })
        },

        editEnabled: ko.observable(false),

        editList: function () {
            viewModel.editEnabled(!viewModel.editEnabled());
        }
    };

    $.each(["simpleList", "groupedList", "customList"], function (i, list) {
        viewModel[list].listVisible = ko.computed(function () {
            return viewModel.selectedTab() === i;
        });

        viewModel.selectedTab.subscribe(function (value) {
            if (viewModel[list].rendered())
                return;
            if (value === i)
                viewModel[list].rendered(true);
        });

        if (i < 2) {
            viewModel[list].editEnabled = viewModel.editEnabled;

            viewModel[list].editConfig = ko.computed(function () {
                return {
                    deleteMode: viewModel.deleteType(),
                    deleteEnabled: true
                };
            });
        }
    });

    viewModel.editTitle = ko.computed(function () {
        return viewModel.editEnabled() ? "Done" : "Edit";
    });

    viewModel.editButtonVisible = ko.computed(function () {
        return viewModel.selectedTab() === 0;
    });

    viewModel.customList.searchQuery.subscribe(function (value) {
        viewModel.customList.dataSource.filter("Name", "contains", value);
        viewModel.customList.dataSource.load();
    });

    viewModel.selectedTab(0);

    return viewModel;
});

  