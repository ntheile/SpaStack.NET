define(['services/dbmobile'], function(db){
    var viewModel = {
        autocomplete: {
            text: ko.observable(""),
            cities: db.cities
        },
        "switch": {
            value: ko.observable(true)
        },
        slider: {
            value: ko.observable(5)
        },
        rangeSlider: {
            minValue: ko.observable(3),
            maxValue: ko.observable(7)
        },
        lookup: {
            data: ["red", "green", "blue", "yellow"],
            value: ko.observable(null)
        },
        selectbox: {
            data: ["light", "dark"],
            value: ko.observable(null)
        },
        checkbox: {
            checked: ko.observable(false)
        },
        radioGroup: {
            items: [
                { text: "Tea" },
                { text: "Coffee" },
                { text: "Juice" }
            ]
        }
    };

    return viewModel;
});