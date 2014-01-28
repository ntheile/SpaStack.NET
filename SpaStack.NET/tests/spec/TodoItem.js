define(['services/datacontext'], function (datacontext) {

    describe("Getting TodoItems in a web service call", function () {
        var ajaxResult = false;
        beforeEach(function (done) {
            datacontext.getTodoItems().done(function() {
                // success
                ajaxResult = true;
                done();
            });
        });
        it("should return true", function (done) {
            expect(ajaxResult).toBe(true);
            done();
        });
    });

});