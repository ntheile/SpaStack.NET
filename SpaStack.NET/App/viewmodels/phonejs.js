define(['services/logger', 'services/datacontext'], function (logger, datacontext) {

    //#region Private Variables

    var autocomplete = {
            text: ko.observable(""),
            cities:  [
                "New York", "Los Angeles", "Chicago", "Houston", "Philadelphia", "Phoenix", "San Antonio",
                "San Diego", "Dallas", "San Jose", "Jacksonville", "Indianapolis", "Austin", "San Francisco",
                "Columbus", "Fort Worth", "Charlotte", "Detroit", "El Paso", "Memphis", "Boston", "Seattle",
                "Denver", "Baltimore", "Washington", "Nashville", "Louisville", "Milwaukee", "Portland", "Oklahoma"
            ]
        },

        slider = {
            value: ko.observable(5)
        },
        rangeSlider = {
            minValue: ko.observable(3),
            maxValue: ko.observable(7)
        },
        lookup = {
            data: ["red", "green", "blue", "yellow"],
            value: ko.observable(null)
        },
        selectbox = {
            data: ["light", "dark"],
            value: ko.observable(null)
        },
        checkbox = {
            checked: ko.observable(false)
        },
        radioGroup = {
            item: [
                { text: "Tea" },
                { text: "Coffee" },
                { text: "Juice" }
            ]
        };


    //#endregion




    //#region Private Methods

    function activate() {
        
        return true;
    }

    //#endregion 




    //#region Public

    // public variables exposed to the view
    var vm = {
        activate: activate,
        autocomplete: autocomplete,
        slider: slider,
        rangeSlider: rangeSlider,
        lookup: lookup,
        selectbox: selectbox,
        checkbox: checkbox,
        radioGroup: radioGroup
    };

    //#endregion

    return vm;
});


