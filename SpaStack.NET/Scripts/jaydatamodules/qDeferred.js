// JayData 1.3.4
// Dual licensed under MIT and GPL v2
// Copyright JayStack Technologies (http://jaydata.org/licensing)
//
// JayData is a standards-based, cross-platform Javascript library and a set of
// practices to access and manipulate data from various online and offline sources.
//
// Credits:
//     Hajnalka Battancs, D�niel J�zsef, J�nos Roden, L�szl� Horv�th, P�ter Nochta
//     P�ter Zentai, R�bert B�nay, Szabolcs Czinege, Viktor Borza, Viktor L�z�r,
//     Zolt�n Gyebrovszki, G�bor Dolla
//
// More info: http://jaydata.org
(function ($data) {
    var q;
    if (typeof Q === 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            q = require('q');
        } else {
            Guard.raise(new Exception('Q is not defined'));
            return;
        }
    } else {
        q = Q;
    }

    $data.Class.define('$data.Deferred', $data.PromiseHandlerBase, null, {
        constructor: function () {
            this.deferred = new q.defer();
        },
        deferred: {},
        createCallback: function (callBack) {
            callBack = $data.typeSystem.createCallbackSetting(callBack);
            var self = this;

            return cbWrapper = {
                success: function () {
                    callBack.success.apply(self.deferred, arguments);
                    self.deferred.resolve.apply(self.deferred, arguments);
                },
                error: function () {
                    Array.prototype.push.call(arguments, self.deferred);
                    callBack.error.apply(self.deferred, arguments);
                    /*self.deferred.reject.apply(self.deferred, arguments);
                    
                    var finalErr;
                    
                    try{
                        callBack.error.apply(self.deferred, arguments);
                        try{
                            self.deferred.reject.apply(self.deferred, arguments);
                        }catch(err){
                            finalErr = err;
                        }
                    }catch(err){
                        finalErr = arguments[0];
                        try{
                            self.deferred.reject.apply(self.deferred, arguments);
                        }catch(err){
                            finalErr = err;
                        }
                    }
                    
                    if (finalErr){
                        //throw finalErr;
                    }*/
                }
            };
        },
        getPromise: function () {
            return this.deferred.promise;
        }
    }, null);

    $data.PromiseHandler = $data.Deferred;

})($data);
