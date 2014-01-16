define([], function(){
    var pointerEvents = [
         { name: "dxpointerdown", displayName: "down" },
         { name: "dxpointermove", displayName: "move" },
         { name: "dxpointerup", displayName: "up" },
         { name: "dxhold", displayName: "hold" }
    ],
     swipeEvents = [
         { name: "dxswipestart", displayName: "start" },
         { name: "dxswipe", displayName: "swipe" },
         { name: "dxswipeend", displayName: "end" }
     ];

    var extendEvents = function (events) {
        return $.map(events, function (event, index) {
            event.count = ko.observable(0);
            event.enabled = ko.observable(true);
            event.badgeVisible = ko.computed(function () {
                return event.count() > 0;
            });
            return event;
        });
    };

    var getAllEvents = function () {
        return pointerEvents.concat(swipeEvents);
    };

    var viewModel = {
        swipeEvents: extendEvents(swipeEvents),
        pointerEvents: extendEvents(pointerEvents)
    };

    viewModel.viewShown = function () {
        var eventsName = "";
        $.each(getAllEvents(), function (index, event) { eventsName += event.name + " "; });
        $(".events-area").on(eventsName, function (e) {
            $.each(getAllEvents(), function (index, item) {
                if (item.enabled() && item.name === e.type) {
                    item.count(item.count() + 1);
                }
            });
        });
    };

    return viewModel;
});

 
