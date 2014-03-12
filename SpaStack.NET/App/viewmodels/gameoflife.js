define(['services/logger', 'durandal/app'], function (logger, app) {

    //#region Internal Methods
    var title = 'Game of Life in JavaScript';

    // 0 = dead
    // 1 = alive

    var rows = 30;
    var cols = 30;
    var grid = ko.observable([]);
    var autoplay = ko.observable(false);
    var autoplaySetTimeoutHolder = ko.observable();
    var autoplaySetTimeoutUpdateHolder = ko.observable();

    var initialize = function () {
        for (var y = 0; y < rows; y++) {
            var row = [];
            for (var x = 0; x < cols; x++) {
                row.push(Math.floor(Math.random() * 2));
            }
            grid().push(ko.observable(row));
        }
    };

    var update = function() {
        var irows = grid();
        var newRows = [];

        // row
        for (var y = 0; y < rows; y++) {
            var currentRow = irows[y]();
            var previousRow = [];
            var nextRow = [];
            var newRow = [];

            if (y > 0) previousRow = irows[y-1](); // if a previous row exist, 1st row does not have a prev row     
            if (y < rows - 1) nextRow = irows[y + 1](); // if a next row exist, last row does not have a next row

            // col
            for (var x = 0; x < cols; x++) {
                var live = 0;

                if (x > 0) live += currentRow[x - 1]; // check if neighbor is alive before or after, exclucing the first item in a row [0,0,0,0,0]
                if (x < cols - 1) live += currentRow[x + 1]; // check if neighbor before is alive, excluding the last item in a row

                if (previousRow.length > 0) {
                    if (x > 0) live += previousRow[x - 1];
                    live += previousRow[x];
                    if (x < cols - 1) live += previousRow[x + 1];
                }

                if (nextRow.length > 0) {
                    if (x > 0) live += nextRow[x - 1];
                    live += nextRow[x];
                    if (x < cols - 1) live += nextRow[x + 1];
                }


                // rule 1 - Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                if (currentRow[x] == 1 && live < 2) {
                    newRow.push(0);
                }
                // rule 2 - Any live cell with two or three live neighbours lives on to the next generation.
                else if (currentRow[x] == 1 && (live == 2 || live == 3)) {
                    newRow.push(1);
                }
                //rule 3 - Any live cell with more than three live neighbours dies, as if by overcrowding.
                else if (currentRow[x] == 1 && live > 3) {
                    newRow.push(0);
                }
                //rule 4 - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                else if (currentRow[x] == 0 && live == 3) {
                    newRow.push(1);
                // otherwise dead
                } else {
                    newRow.push(0);
                    
                }
            }

            newRows.push(ko.observable(newRow));

        };

        grid(newRows);

        if (autoplay() == true) {
            autoplaySetTimeoutUpdateHolder(window.setTimeout(update, 100));

        }

    };

    var play = function () {
        autoplay(true);
        autoplaySetTimeoutHolder(window.setTimeout(update, 100));
    };

    var pause = function () {
        autoplay(false);
        clearTimeout(autoplaySetTimeoutUpdateHolder());
        clearTimeout(autoplaySetTimeoutHolder());
    };

    var reset = function () {
        pause();
        autoplay(false);
        grid([]);
        initialize();
        update();
    };

    
    function activate() {
        initialize();
        return true;
    }

    //#endregion




    // public scope
    var vm = {
        activate: activate,
        title: title,
        rows: rows,
        cols: cols,
        grid: grid,
        autoplay: autoplay,
        initialize: initialize,
        update: update,
        play: play,
        reset: reset,
        pause: pause,
        autoplaySetTimeoutUpdateHolder: autoplaySetTimeoutUpdateHolder,
        autoplaySetTimeoutHolder: autoplaySetTimeoutHolder,
    };

    return vm;

});
