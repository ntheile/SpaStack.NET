(function () {
/**
 * almond 0.2.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name) && !defining.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    function onResourceLoad(name, defined, deps){
        if(requirejs.onResourceLoad && name){
            requirejs.onResourceLoad({defined:defined}, {id:name}, deps);
        }
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (defined.hasOwnProperty(depName) ||
                           waiting.hasOwnProperty(depName) ||
                           defining.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }

        onResourceLoad(name, defined, args);
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("../Scripts/almond-custom", function(){});

define('durandal/system',["require","jquery"],function(e,t){function n(e){var t="[object "+e+"]";i["is"+e]=function(e){return u.call(e)==t}}var i,r=!1,o=Object.keys,a=Object.prototype.hasOwnProperty,u=Object.prototype.toString,s=!1,l=Array.isArray,c=Array.prototype.slice;if(Function.prototype.bind&&("object"==typeof console||"function"==typeof console)&&"object"==typeof console.log)try{["log","info","warn","error","assert","dir","clear","profile","profileEnd"].forEach(function(e){console[e]=this.call(console[e],console)},Function.prototype.bind)}catch(d){s=!0}e.on&&e.on("moduleLoaded",function(e,t){i.setModuleId(e,t)}),"undefined"!=typeof requirejs&&(requirejs.onResourceLoad=function(e,t){i.setModuleId(e.defined[t.id],t.id)});var f=function(){},v=function(){try{if("undefined"!=typeof console&&"function"==typeof console.log)if(window.opera)for(var e=0;e<arguments.length;)console.log("Item "+(e+1)+": "+arguments[e]),e++;else 1==c.call(arguments).length&&"string"==typeof c.call(arguments)[0]?console.log(c.call(arguments).toString()):console.log.apply(console,c.call(arguments));else Function.prototype.bind&&!s||"undefined"==typeof console||"object"!=typeof console.log||Function.prototype.call.call(console.log,console,c.call(arguments))}catch(t){}},g=function(e){if(e instanceof Error)throw e;throw new Error(e)};i={version:"2.0.0",noop:f,getModuleId:function(e){return e?"function"==typeof e?e.prototype.__moduleId__:"string"==typeof e?null:e.__moduleId__:null},setModuleId:function(e,t){return e?"function"==typeof e?(e.prototype.__moduleId__=t,void 0):("string"!=typeof e&&(e.__moduleId__=t),void 0):void 0},resolveObject:function(e){return i.isFunction(e)?new e:e},debug:function(e){return 1==arguments.length&&(r=e,r?(this.log=v,this.error=g,this.log("Debug:Enabled")):(this.log("Debug:Disabled"),this.log=f,this.error=f)),r},log:f,error:f,assert:function(e,t){e||i.error(new Error(t||"Assert:Failed"))},defer:function(e){return t.Deferred(e)},guid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=0|16*Math.random(),n="x"==e?t:8|3&t;return n.toString(16)})},acquire:function(){var t,n=arguments[0],r=!1;return i.isArray(n)?(t=n,r=!0):t=c.call(arguments,0),this.defer(function(n){e(t,function(){var e=arguments;setTimeout(function(){e.length>1||r?n.resolve(c.call(e,0)):n.resolve(e[0])},1)},function(e){n.reject(e)})}).promise()},extend:function(e){for(var t=c.call(arguments,1),n=0;n<t.length;n++){var i=t[n];if(i)for(var r in i)e[r]=i[r]}return e},wait:function(e){return i.defer(function(t){setTimeout(t.resolve,e)}).promise()}},i.keys=o||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var n in e)a.call(e,n)&&(t[t.length]=n);return t},i.isElement=function(e){return!(!e||1!==e.nodeType)},i.isArray=l||function(e){return"[object Array]"==u.call(e)},i.isObject=function(e){return e===Object(e)},i.isBoolean=function(e){return"boolean"==typeof e},i.isPromise=function(e){return e&&i.isFunction(e.then)};for(var m=["Arguments","Function","String","Number","Date","RegExp"],p=0;p<m.length;p++)n(m[p]);return i});
define('durandal/viewEngine',["durandal/system","jquery"],function(e,t){var n;return n=t.parseHTML?function(e){return t.parseHTML(e)}:function(e){return t(e).get()},{viewExtension:".html",viewPlugin:"text",isViewUrl:function(e){return-1!==e.indexOf(this.viewExtension,e.length-this.viewExtension.length)},convertViewUrlToViewId:function(e){return e.substring(0,e.length-this.viewExtension.length)},convertViewIdToRequirePath:function(e){return this.viewPlugin+"!"+e+this.viewExtension},parseMarkup:n,processMarkup:function(e){var t=this.parseMarkup(e);return this.ensureSingleElement(t)},ensureSingleElement:function(e){if(1==e.length)return e[0];for(var n=[],i=0;i<e.length;i++){var r=e[i];if(8!=r.nodeType){if(3==r.nodeType){var o=/\S/.test(r.nodeValue);if(!o)continue}n.push(r)}}return n.length>1?t(n).wrapAll('<div class="durandal-wrapper"></div>').parent().get(0):n[0]},createView:function(t){var n=this,i=this.convertViewIdToRequirePath(t);return e.defer(function(r){e.acquire(i).then(function(e){var i=n.processMarkup(e);i.setAttribute("data-view",t),r.resolve(i)}).fail(function(e){n.createFallbackView(t,i,e).then(function(e){e.setAttribute("data-view",t),r.resolve(e)})})}).promise()},createFallbackView:function(t,n){var i=this,r='View Not Found. Searched for "'+t+'" via path "'+n+'".';return e.defer(function(e){e.resolve(i.processMarkup('<div class="durandal-view-404">'+r+"</div>"))}).promise()}}});
define('durandal/viewLocator',["durandal/system","durandal/viewEngine"],function(e,t){function n(e,t){for(var n=0;n<e.length;n++){var i=e[n],r=i.getAttribute("data-view");if(r==t)return i}}function i(e){return(e+"").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g,"\\$1")}return{useConvention:function(e,t,n){e=e||"viewmodels",t=t||"views",n=n||t;var r=new RegExp(i(e),"gi");this.convertModuleIdToViewId=function(e){return e.replace(r,t)},this.translateViewIdToArea=function(e,t){return t&&"partial"!=t?n+"/"+t+"/"+e:n+"/"+e}},locateViewForObject:function(t,n,i){var r;if(t.getView&&(r=t.getView()))return this.locateView(r,n,i);if(t.viewUrl)return this.locateView(t.viewUrl,n,i);var o=e.getModuleId(t);return o?this.locateView(this.convertModuleIdToViewId(o),n,i):this.locateView(this.determineFallbackViewId(t),n,i)},convertModuleIdToViewId:function(e){return e},determineFallbackViewId:function(e){var t=/function (.{1,})\(/,n=t.exec(e.constructor.toString()),i=n&&n.length>1?n[1]:"";return"views/"+i},translateViewIdToArea:function(e){return e},locateView:function(i,r,o){if("string"==typeof i){var a;if(a=t.isViewUrl(i)?t.convertViewUrlToViewId(i):i,r&&(a=this.translateViewIdToArea(a,r)),o){var u=n(o,a);if(u)return e.defer(function(e){e.resolve(u)}).promise()}return t.createView(a)}return e.defer(function(e){e.resolve(i)}).promise()}}});
define('durandal/binder',["durandal/system","knockout"],function(e,t){function n(t){return void 0===t?{applyBindings:!0}:e.isBoolean(t)?{applyBindings:t}:(void 0===t.applyBindings&&(t.applyBindings=!0),t)}function i(i,l,c,d){if(!l||!c)return r.throwOnErrors?e.error(a):e.log(a,l,d),void 0;if(!l.getAttribute)return r.throwOnErrors?e.error(o):e.log(o,l,d),void 0;var f=l.getAttribute("data-view");try{var m;return i&&i.binding&&(m=i.binding(l)),m=n(m),r.binding(d,l,m),m.applyBindings?(e.log("Binding",f,d),t.applyBindings(c,l)):i&&t.utils.domData.set(l,s,{$data:i}),r.bindingComplete(d,l,m),i&&i.bindingComplete&&i.bindingComplete(l),t.utils.domData.set(l,u,m),m}catch(v){v.message=v.message+";\nView: "+f+";\nModuleId: "+e.getModuleId(d),r.throwOnErrors?e.error(v):e.log(v.message)}}var r,a="Insufficient Information to Bind",o="Unexpected View Type",u="durandal-binding-instruction",s="__ko_bindingContext__";return r={binding:e.noop,bindingComplete:e.noop,throwOnErrors:!1,getBindingInstruction:function(e){return t.utils.domData.get(e,u)},bindContext:function(e,t,n){return n&&e&&(e=e.createChildContext(n)),i(n,t,e,n||(e?e.$data:null))},bind:function(e,t){return i(e,t,e,e)}}});
define('durandal/activator',["durandal/system","knockout"],function(e,t){function n(e){return void 0==e&&(e={}),e.closeOnDeactivate||(e.closeOnDeactivate=l.defaults.closeOnDeactivate),e.beforeActivate||(e.beforeActivate=l.defaults.beforeActivate),e.afterDeactivate||(e.afterDeactivate=l.defaults.afterDeactivate),e.affirmations||(e.affirmations=l.defaults.affirmations),e.interpretResponse||(e.interpretResponse=l.defaults.interpretResponse),e.areSameItem||(e.areSameItem=l.defaults.areSameItem),e}function i(t,n,i){return e.isArray(i)?t[n].apply(t,i):t[n](i)}function r(t,n,i,r,a){if(t&&t.deactivate){e.log("Deactivating",t);var o;try{o=t.deactivate(n)}catch(u){return e.error(u),r.resolve(!1),void 0}o&&o.then?o.then(function(){i.afterDeactivate(t,n,a),r.resolve(!0)},function(t){e.log(t),r.resolve(!1)}):(i.afterDeactivate(t,n,a),r.resolve(!0))}else t&&i.afterDeactivate(t,n,a),r.resolve(!0)}function a(t,n,r,a){if(t)if(t.activate){e.log("Activating",t);var o;try{o=i(t,"activate",a)}catch(u){return e.error(u),r(!1),void 0}o&&o.then?o.then(function(){n(t),r(!0)},function(t){e.log(t),r(!1)}):(n(t),r(!0))}else n(t),r(!0);else r(!0)}function o(t,n,i){return i.lifecycleData=null,e.defer(function(r){if(t&&t.canDeactivate){var a;try{a=t.canDeactivate(n)}catch(o){return e.error(o),r.resolve(!1),void 0}a.then?a.then(function(e){i.lifecycleData=e,r.resolve(i.interpretResponse(e))},function(t){e.error(t),r.resolve(!1)}):(i.lifecycleData=a,r.resolve(i.interpretResponse(a)))}else r.resolve(!0)}).promise()}function u(t,n,r,a){return r.lifecycleData=null,e.defer(function(o){if(t==n())return o.resolve(!0),void 0;if(t&&t.canActivate){var u;try{u=i(t,"canActivate",a)}catch(s){return e.error(s),o.resolve(!1),void 0}u.then?u.then(function(e){r.lifecycleData=e,o.resolve(r.interpretResponse(e))},function(t){e.error(t),o.resolve(!1)}):(r.lifecycleData=u,o.resolve(r.interpretResponse(u)))}else o.resolve(!0)}).promise()}function s(i,s){var l,c=t.observable(null);s=n(s);var d=t.computed({read:function(){return c()},write:function(e){d.viaSetter=!0,d.activateItem(e)}});return d.__activator__=!0,d.settings=s,s.activator=d,d.isActivating=t.observable(!1),d.canDeactivateItem=function(e,t){return o(e,t,s)},d.deactivateItem=function(t,n){return e.defer(function(e){d.canDeactivateItem(t,n).then(function(i){i?r(t,n,s,e,c):(d.notifySubscribers(),e.resolve(!1))})}).promise()},d.canActivateItem=function(e,t){return u(e,c,s,t)},d.activateItem=function(t,n){var i=d.viaSetter;return d.viaSetter=!1,e.defer(function(o){if(d.isActivating())return o.resolve(!1),void 0;d.isActivating(!0);var u=c();return s.areSameItem(u,t,l,n)?(d.isActivating(!1),o.resolve(!0),void 0):(d.canDeactivateItem(u,s.closeOnDeactivate).then(function(f){f?d.canActivateItem(t,n).then(function(f){f?e.defer(function(e){r(u,s.closeOnDeactivate,s,e)}).promise().then(function(){t=s.beforeActivate(t,n),a(t,c,function(e){l=n,d.isActivating(!1),o.resolve(e)},n)}):(i&&d.notifySubscribers(),d.isActivating(!1),o.resolve(!1))}):(i&&d.notifySubscribers(),d.isActivating(!1),o.resolve(!1))}),void 0)}).promise()},d.canActivate=function(){var e;return i?(e=i,i=!1):e=d(),d.canActivateItem(e)},d.activate=function(){var e;return i?(e=i,i=!1):e=d(),d.activateItem(e)},d.canDeactivate=function(e){return d.canDeactivateItem(d(),e)},d.deactivate=function(e){return d.deactivateItem(d(),e)},d.includeIn=function(e){e.canActivate=function(){return d.canActivate()},e.activate=function(){return d.activate()},e.canDeactivate=function(e){return d.canDeactivate(e)},e.deactivate=function(e){return d.deactivate(e)}},s.includeIn?d.includeIn(s.includeIn):i&&d.activate(),d.forItems=function(t){s.closeOnDeactivate=!1,s.determineNextItemToActivate=function(e,t){var n=t-1;return-1==n&&e.length>1?e[1]:n>-1&&n<e.length-1?e[n]:null},s.beforeActivate=function(e){var n=d();if(e){var i=t.indexOf(e);-1==i?t.push(e):e=t()[i]}else e=s.determineNextItemToActivate(t,n?t.indexOf(n):0);return e},s.afterDeactivate=function(e,n){n&&t.remove(e)};var n=d.canDeactivate;d.canDeactivate=function(i){return i?e.defer(function(e){function n(){for(var t=0;t<a.length;t++)if(!a[t])return e.resolve(!1),void 0;e.resolve(!0)}for(var r=t(),a=[],o=0;o<r.length;o++)d.canDeactivateItem(r[o],i).then(function(e){a.push(e),a.length==r.length&&n()})}).promise():n()};var i=d.deactivate;return d.deactivate=function(n){return n?e.defer(function(e){function i(i){d.deactivateItem(i,n).then(function(){a++,t.remove(i),a==o&&e.resolve()})}for(var r=t(),a=0,o=r.length,u=0;o>u;u++)i(r[u])}).promise():i()},d},d}var l,c={closeOnDeactivate:!0,affirmations:["yes","ok","true"],interpretResponse:function(n){return e.isObject(n)&&(n=n.can||!1),e.isString(n)?-1!==t.utils.arrayIndexOf(this.affirmations,n.toLowerCase()):n},areSameItem:function(e,t){return e==t},beforeActivate:function(e){return e},afterDeactivate:function(e,t,n){t&&n&&n(null)}};return l={defaults:c,create:s,isActivator:function(e){return e&&e.__activator__}}});
define('durandal/composition',["durandal/system","durandal/viewLocator","durandal/binder","durandal/viewEngine","durandal/activator","jquery","knockout"],function(e,t,n,i,r,a,o){function u(e){for(var t=[],n={childElements:t,activeView:null},i=o.virtualElements.firstChild(e);i;)1==i.nodeType&&(t.push(i),i.getAttribute(h)&&(n.activeView=i)),i=o.virtualElements.nextSibling(i);return n.activeView||(n.activeView=t[0]),n}function s(){w--,0===w&&setTimeout(function(){for(var e=b.length;e--;)b[e]();b=[]},1)}function l(t,n,i){if(i)n();else if(t.activate&&t.model&&t.model.activate){var r;r=e.isArray(t.activationData)?t.model.activate.apply(t.model,t.activationData):t.model.activate(t.activationData),r&&r.then?r.then(n):r||void 0===r?n():s()}else n()}function c(){var t=this;t.activeView&&t.activeView.removeAttribute(h),t.child&&(t.model&&t.model.attached&&(t.composingNewView||t.alwaysTriggerAttach)&&t.model.attached(t.child,t.parent,t),t.attached&&t.attached(t.child,t.parent,t),t.child.setAttribute(h,!0),t.composingNewView&&t.model&&(t.model.compositionComplete&&p.current.complete(function(){t.model.compositionComplete(t.child,t.parent,t)}),t.model.detached&&o.utils.domNodeDisposal.addDisposeCallback(t.child,function(){t.model.detached(t.child,t.parent,t)})),t.compositionComplete&&p.current.complete(function(){t.compositionComplete(t.child,t.parent,t)})),s(),t.triggerAttach=e.noop}function d(t){if(e.isString(t.transition)){if(t.activeView){if(t.activeView==t.child)return!1;if(!t.child)return!0;if(t.skipTransitionOnSameViewId){var n=t.activeView.getAttribute("data-view"),i=t.child.getAttribute("data-view");return n!=i}}return!0}return!1}function f(e){for(var t=0,n=e.length,i=[];n>t;t++){var r=e[t].cloneNode(!0);i.push(r)}return i}function m(e){var t=f(e.parts),n=p.getParts(t),i=p.getParts(e.child);for(var r in n)a(i[r]).replaceWith(n[r])}function v(t){var n,i,r=o.virtualElements.childNodes(t);if(!e.isArray(r)){var a=[];for(n=0,i=r.length;i>n;n++)a[n]=r[n];r=a}for(n=1,i=r.length;i>n;n++)o.removeNode(r[n])}var p,g={},h="data-active-view",b=[],w=0,y="durandal-composition-data",x="data-part",I="["+x+"]",A=["model","view","transition","area","strategy","activationData"],q={complete:function(e){b.push(e)}};return p={convertTransitionToModuleId:function(e){return"transitions/"+e},defaultTransitionName:null,current:q,addBindingHandler:function(e,t,n){var i,r,a="composition-handler-"+e;t=t||o.bindingHandlers[e],n=n||function(){return void 0},r=o.bindingHandlers[e]={init:function(e,i,r,u,s){var l={trigger:o.observable(null)};return p.current.complete(function(){t.init&&t.init(e,i,r,u,s),t.update&&(o.utils.domData.set(e,a,t),l.trigger("trigger"))}),o.utils.domData.set(e,a,l),n(e,i,r,u,s)},update:function(e,t,n,i,r){var u=o.utils.domData.get(e,a);return u.update?u.update(e,t,n,i,r):(u.trigger(),void 0)}};for(i in t)"init"!==i&&"update"!==i&&(r[i]=t[i])},getParts:function(t){var n={};e.isArray(t)||(t=[t]);for(var i=0;i<t.length;i++){var r=t[i];if(r.getAttribute){var o=r.getAttribute(x);o&&(n[o]=r);for(var u=a(I,r).not(a("[data-bind] "+I,r)),s=0;s<u.length;s++){var l=u.get(s);n[l.getAttribute(x)]=l}}}return n},cloneNodes:f,finalize:function(t){if(t.transition=t.transition||this.defaultTransitionName,t.child||t.activeView)if(d(t)){var i=this.convertTransitionToModuleId(t.transition);e.acquire(i).then(function(e){t.transition=e,e(t).then(function(){if(t.cacheViews){if(t.activeView){var e=n.getBindingInstruction(t.activeView);void 0==e.cacheViews||e.cacheViews||o.removeNode(t.activeView)}}else t.child?v(t.parent):o.virtualElements.emptyNode(t.parent);t.triggerAttach()})}).fail(function(t){e.error("Failed to load transition ("+i+"). Details: "+t.message)})}else{if(t.child!=t.activeView){if(t.cacheViews&&t.activeView){var r=n.getBindingInstruction(t.activeView);void 0==r.cacheViews||r.cacheViews?a(t.activeView).hide():o.removeNode(t.activeView)}t.child?(t.cacheViews||v(t.parent),a(t.child).show()):t.cacheViews||o.virtualElements.emptyNode(t.parent)}t.triggerAttach()}else t.cacheViews||o.virtualElements.emptyNode(t.parent),t.triggerAttach()},bindAndShow:function(e,t,r){t.child=e,t.composingNewView=t.cacheViews?-1==o.utils.arrayIndexOf(t.viewElements,e):!0,l(t,function(){if(t.binding&&t.binding(t.child,t.parent,t),t.preserveContext&&t.bindingContext)t.composingNewView&&(t.parts&&m(t),a(e).hide(),o.virtualElements.prepend(t.parent,e),n.bindContext(t.bindingContext,e,t.model));else if(e){var r=t.model||g,u=o.dataFor(e);if(u!=r){if(!t.composingNewView)return a(e).remove(),i.createView(e.getAttribute("data-view")).then(function(e){p.bindAndShow(e,t,!0)}),void 0;t.parts&&m(t),a(e).hide(),o.virtualElements.prepend(t.parent,e),n.bind(r,e)}}p.finalize(t)},r)},defaultStrategy:function(e){return t.locateViewForObject(e.model,e.area,e.viewElements)},getSettings:function(t){var n,a=t(),u=o.utils.unwrapObservable(a)||{},s=r.isActivator(a);if(e.isString(u))return u=i.isViewUrl(u)?{view:u}:{model:u,activate:!0};if(n=e.getModuleId(u))return u={model:u,activate:!0};!s&&u.model&&(s=r.isActivator(u.model));for(var l in u)u[l]=-1!=o.utils.arrayIndexOf(A,l)?o.utils.unwrapObservable(u[l]):u[l];return s?u.activate=!1:void 0===u.activate&&(u.activate=!0),u},executeStrategy:function(e){e.strategy(e).then(function(t){p.bindAndShow(t,e)})},inject:function(n){return n.model?n.view?(t.locateView(n.view,n.area,n.viewElements).then(function(e){p.bindAndShow(e,n)}),void 0):(n.strategy||(n.strategy=this.defaultStrategy),e.isString(n.strategy)?e.acquire(n.strategy).then(function(e){n.strategy=e,p.executeStrategy(n)}).fail(function(t){e.error("Failed to load view strategy ("+n.strategy+"). Details: "+t.message)}):this.executeStrategy(n),void 0):(this.bindAndShow(null,n),void 0)},compose:function(n,i,r,a){w++,a||(i=p.getSettings(function(){return i},n));var o=u(n);i.activeView=o.activeView,i.parent=n,i.triggerAttach=c,i.bindingContext=r,i.cacheViews&&!i.viewElements&&(i.viewElements=o.childElements),i.model?e.isString(i.model)?e.acquire(i.model).then(function(t){i.model=e.resolveObject(t),p.inject(i)}).fail(function(t){e.error("Failed to load composed module ("+i.model+"). Details: "+t.message)}):p.inject(i):i.view?(i.area=i.area||"partial",i.preserveContext=!0,t.locateView(i.view,i.area,i.viewElements).then(function(e){p.bindAndShow(e,i)})):this.bindAndShow(null,i)}},o.bindingHandlers.compose={init:function(){return{controlsDescendantBindings:!0}},update:function(e,t,n,r,a){var u=p.getSettings(t,e);if(u.mode){var s=o.utils.domData.get(e,y);if(!s){var l=o.virtualElements.childNodes(e);s={},"inline"===u.mode?s.view=i.ensureSingleElement(l):"templated"===u.mode&&(s.parts=f(l)),o.virtualElements.emptyNode(e),o.utils.domData.set(e,y,s)}"inline"===u.mode?u.view=s.view.cloneNode(!0):"templated"===u.mode&&(u.parts=s.parts),u.preserveContext=!0}p.compose(e,u,a,!0)}},o.virtualElements.allowedBindings.compose=!0,p});
define('services/binding-handlers',["durandal/system","durandal/composition"],function(e,t){t.addBindingHandler("mmenu",{init:function(e){$("a#open-icon-menu").click(function(t){t.stopImmediatePropagation(),t.preventDefault(),$(e).trigger("toggle.mm")}),$(e).mmenu()}})});
define('durandal/events',["durandal/system"],function(e){var t=/\s+/,n=function(){},i=function(e,t){this.owner=e,this.events=t};return i.prototype.then=function(e,t){return this.callback=e||this.callback,this.context=t||this.context,this.callback?(this.owner.on(this.events,this.callback,this.context),this):this},i.prototype.on=i.prototype.then,i.prototype.off=function(){return this.owner.off(this.events,this.callback,this.context),this},n.prototype.on=function(e,n,r){var a,o,u;if(n){for(a=this.callbacks||(this.callbacks={}),e=e.split(t);o=e.shift();)u=a[o]||(a[o]=[]),u.push(n,r);return this}return new i(this,e)},n.prototype.off=function(n,i,r){var a,o,u,s;if(!(o=this.callbacks))return this;if(!(n||i||r))return delete this.callbacks,this;for(n=n?n.split(t):e.keys(o);a=n.shift();)if((u=o[a])&&(i||r))for(s=u.length-2;s>=0;s-=2)i&&u[s]!==i||r&&u[s+1]!==r||u.splice(s,2);else delete o[a];return this},n.prototype.trigger=function(e){var n,i,r,a,o,u,s,l;if(!(i=this.callbacks))return this;for(l=[],e=e.split(t),a=1,o=arguments.length;o>a;a++)l[a-1]=arguments[a];for(;n=e.shift();){if((s=i.all)&&(s=s.slice()),(r=i[n])&&(r=r.slice()),r)for(a=0,o=r.length;o>a;a+=2)r[a].apply(r[a+1]||this,l);if(s)for(u=[n].concat(l),a=0,o=s.length;o>a;a+=2)s[a].apply(s[a+1]||this,u)}return this},n.prototype.proxy=function(e){var t=this;return function(n){t.trigger(e,n)}},n.includeIn=function(e){e.on=n.prototype.on,e.off=n.prototype.off,e.trigger=n.prototype.trigger,e.proxy=n.prototype.proxy},n});
define('durandal/app',["durandal/system","durandal/viewEngine","durandal/composition","durandal/events","jquery"],function(e,t,n,i,r){function a(){return e.defer(function(t){return 0==u.length?(t.resolve(),void 0):(e.acquire(u).then(function(n){for(var i=0;i<n.length;i++){var r=n[i];if(r.install){var a=s[i];e.isObject(a)||(a={}),r.install(a),e.log("Plugin:Installed "+u[i])}else e.log("Plugin:Loaded "+u[i])}t.resolve()}).fail(function(t){e.error("Failed to load plugin(s). Details: "+t.message)}),void 0)}).promise()}var o,u=[],s=[];return o={title:"Application",configurePlugins:function(t,n){var i=e.keys(t);n=n||"plugins/",-1===n.indexOf("/",n.length-1)&&(n+="/");for(var r=0;r<i.length;r++){var a=i[r];u.push(n+a),s.push(t[a])}},start:function(){return e.log("Application:Starting"),this.title&&(document.title=this.title),e.defer(function(t){r(function(){a().then(function(){t.resolve(),e.log("Application:Started")})})}).promise()},setRoot:function(i,r,a){var o,u={activate:!0,transition:r};o=!a||e.isString(a)?document.getElementById(a||"applicationHost"):a,e.isString(i)?t.isViewUrl(i)?u.view=i:u.model=i:u.model=i,n.compose(o,u)}},i.includeIn(o),o});
define('plugins/history',["durandal/system","jquery"],function(e,t){function n(e,t,n){if(n){var i=e.href.replace(/(javascript:|#).*$/,"");e.replace(i+"#"+t)}else e.hash="#"+t}var i=/^[#\/]|\s+$/g,r=/^\/+|\/+$/g,a=/msie [\w.]+/,o=/\/$/,s={interval:50,active:!1};return"undefined"!=typeof window&&(s.location=window.location,s.history=window.history),s.getHash=function(e){var t=(e||s).location.href.match(/#(.*)$/);return t?t[1]:""},s.getFragment=function(e,t){if(null==e)if(s._hasPushState||!s._wantsHashChange||t){e=s.location.pathname;var n=s.root.replace(o,"");e.indexOf(n)||(e=e.substr(n.length))}else e=s.getHash();return e.replace(i,"")},s.activate=function(n){s.active&&e.error("History has already been activated."),s.active=!0,s.options=e.extend({},{root:"/"},s.options,n),s.root=s.options.root,s._wantsHashChange=s.options.hashChange!==!1,s._wantsPushState=!!s.options.pushState,s._hasPushState=!!(s.options.pushState&&s.history&&s.history.pushState);var o=s.getFragment(),u=document.documentMode,l=a.exec(navigator.userAgent.toLowerCase())&&(!u||7>=u);s.root=("/"+s.root+"/").replace(r,"/"),l&&s._wantsHashChange&&(s.iframe=t('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,s.navigate(o,!1)),s._hasPushState?t(window).on("popstate",s.checkUrl):s._wantsHashChange&&"onhashchange"in window&&!l?t(window).on("hashchange",s.checkUrl):s._wantsHashChange&&(s._checkUrlInterval=setInterval(s.checkUrl,s.interval)),s.fragment=o;var c=s.location,d=c.pathname.replace(/[^\/]$/,"$&/")===s.root;if(s._wantsHashChange&&s._wantsPushState){if(!s._hasPushState&&!d)return s.fragment=s.getFragment(null,!0),s.location.replace(s.root+s.location.search+"#"+s.fragment),!0;s._hasPushState&&d&&c.hash&&(this.fragment=s.getHash().replace(i,""),this.history.replaceState({},document.title,s.root+s.fragment+c.search))}return s.options.silent?void 0:s.loadUrl()},s.deactivate=function(){t(window).off("popstate",s.checkUrl).off("hashchange",s.checkUrl),clearInterval(s._checkUrlInterval),s.active=!1},s.checkUrl=function(){var e=s.getFragment();return e===s.fragment&&s.iframe&&(e=s.getFragment(s.getHash(s.iframe))),e===s.fragment?!1:(s.iframe&&s.navigate(e,!1),s.loadUrl(),void 0)},s.loadUrl=function(e){var t=s.fragment=s.getFragment(e);return s.options.routeHandler?s.options.routeHandler(t):!1},s.navigate=function(t,i){if(!s.active)return!1;if(void 0===i?i={trigger:!0}:e.isBoolean(i)&&(i={trigger:i}),t=s.getFragment(t||""),s.fragment!==t){s.fragment=t;var r=s.root+t;if(s._hasPushState)s.history[i.replace?"replaceState":"pushState"]({},document.title,r);else{if(!s._wantsHashChange)return s.location.assign(r);n(s.location,t,i.replace),s.iframe&&t!==s.getFragment(s.getHash(s.iframe))&&(i.replace||s.iframe.document.open().close(),n(s.iframe.location,t,i.replace))}return i.trigger?s.loadUrl(t):void 0}},s.navigateBack=function(){s.history.back()},s});
define('plugins/router',["durandal/system","durandal/app","durandal/activator","durandal/events","durandal/composition","plugins/history","knockout","jquery"],function(e,t,n,i,r,o,a,u){function s(e){return e=e.replace(b,"\\$&").replace(m,"(?:$1)?").replace(p,function(e,t){return t?e:"([^/]+)"}).replace(h,"(.*?)"),new RegExp("^"+e+"$")}function l(e){var t=e.indexOf(":"),n=t>0?t-1:e.length;return e.substring(0,n)}function c(e){return e.router&&e.router.loadUrl}function d(e,t){return-1!==e.indexOf(t,e.length-t.length)}function f(e,t){if(!e||!t)return!1;if(e.length!=t.length)return!1;for(var n=0,i=e.length;i>n;n++)if(e[n]!=t[n])return!1;return!0}var v,g,m=/\((.*?)\)/g,p=/(\(\?)?:\w+/g,h=/\*\w+/g,b=/[\-{}\[\]+?.,\\\^$|#\s]/g,y=/\/$/,w=function(){function r(t,n){e.log("Navigation Complete",t,n);var i=e.getModuleId(D);i&&O.trigger("router:navigation:from:"+i),D=t,V=n;var r=e.getModuleId(D);r&&O.trigger("router:navigation:to:"+r),c(t)||O.updateDocumentTitle(t,n),g.explicitNavigation=!1,g.navigatingBack=!1,O.trigger("router:navigation:complete",t,n,O)}function u(t,n){e.log("Navigation Cancelled"),O.activeInstruction(V),V&&O.navigate(V.fragment,!1),C(!1),g.explicitNavigation=!1,g.navigatingBack=!1,O.trigger("router:navigation:cancelled",t,n,O)}function m(t){e.log("Navigation Redirecting"),C(!1),g.explicitNavigation=!1,g.navigatingBack=!1,O.navigate(t,{trigger:!0,replace:!0})}function p(e,t,n){g.navigatingBack=!g.explicitNavigation&&D!=n.fragment,O.trigger("router:route:activating",t,n,O),e.activateItem(t,n.params).then(function(i){if(i){var o=D;r(t,n),c(t)&&_({router:t.router,fragment:n.fragment,queryString:n.queryString}),o==t&&O.attached()}else e.settings.lifecycleData&&e.settings.lifecycleData.redirect?m(e.settings.lifecycleData.redirect):u(t,n);v&&(v.resolve(),v=null)})}function h(t,n,i){var r=O.guardRoute(n,i);r?r.then?r.then(function(r){r?e.isString(r)?m(r):p(t,n,i):u(n,i)}):e.isString(r)?m(r):p(t,n,i):u(n,i)}function b(e,t,n){O.guardRoute?h(e,t,n):p(e,t,n)}function x(e){return V&&V.config.moduleId==e.config.moduleId&&D&&(D.canReuseForRoute&&D.canReuseForRoute.apply(D,e.params)||D.router&&D.router.loadUrl)}function I(){if(!C()){var t=P.shift();if(P=[],t){if(t.router){var i=t.fragment;return t.queryString&&(i+="?"+t.queryString),t.router.loadUrl(i),void 0}C(!0),O.activeInstruction(t),x(t)?b(n.create(),D,t):e.acquire(t.config.moduleId).then(function(n){var i=e.resolveObject(n);b(T,i,t)}).fail(function(n){e.error("Failed to load routed module ("+t.config.moduleId+"). Details: "+n.message)})}}}function _(e){P.unshift(e),I()}function k(e,t,n){for(var i=e.exec(t).slice(1),r=0;r<i.length;r++){var o=i[r];i[r]=o?decodeURIComponent(o):null}var a=O.parseQueryString(n);return a&&i.push(a),{params:i,queryParams:a}}function S(t){O.trigger("router:route:before-config",t,O),e.isRegExp(t)?t.routePattern=t.route:(t.title=t.title||O.convertRouteToTitle(t.route),t.moduleId=t.moduleId||O.convertRouteToModuleId(t.route),t.hash=t.hash||O.convertRouteToHash(t.route),t.routePattern=s(t.route)),O.trigger("router:route:after-config",t,O),O.routes.push(t),O.route(t.routePattern,function(e,n){var i=k(t.routePattern,e,n);_({fragment:e,queryString:n,config:t,params:i.params,queryParams:i.queryParams})})}function A(t){if(e.isArray(t.route))for(var n=0,i=t.route.length;i>n;n++){var r=e.extend({},t);r.route=t.route[n],n>0&&delete r.nav,S(r)}else S(t);return O}function q(e){e.isActive||(e.isActive=a.computed(function(){var t=T();return t&&t.__moduleId__==e.moduleId}))}var D,V,P=[],C=a.observable(!1),T=n.create(),O={handlers:[],routes:[],navigationModel:a.observableArray([]),activeItem:T,isNavigating:a.computed(function(){var e=T(),t=C(),n=e&&e.router&&e.router!=O&&e.router.isNavigating()?!0:!1;return t||n}),activeInstruction:a.observable(null),__router__:!0};return i.includeIn(O),T.settings.areSameItem=function(e,t,n,i){return e==t?f(n,i):!1},O.parseQueryString=function(e){var t,n;if(!e)return null;if(n=e.split("&"),0==n.length)return null;t={};for(var i=0;i<n.length;i++){var r=n[i];if(""!==r){var o=r.split("=");t[o[0]]=o[1]&&decodeURIComponent(o[1].replace(/\+/g," "))}}return t},O.route=function(e,t){O.handlers.push({routePattern:e,callback:t})},O.loadUrl=function(t){var n=O.handlers,i=null,r=t,a=t.indexOf("?");if(-1!=a&&(r=t.substring(0,a),i=t.substr(a+1)),O.relativeToParentRouter){var u=this.parent.activeInstruction();r=u.params.join("/"),r&&"/"==r[0]&&(r=r.substr(1)),r||(r=""),r=r.replace("//","/").replace("//","/")}r=r.replace(y,"");for(var s=0;s<n.length;s++){var l=n[s];if(l.routePattern.test(r))return l.callback(r,i),!0}return e.log("Route Not Found"),O.trigger("router:route:not-found",t,O),V&&o.navigate(V.fragment,{trigger:!1,replace:!0}),g.explicitNavigation=!1,g.navigatingBack=!1,!1},O.updateDocumentTitle=function(e,n){n.config.title?document.title=t.title?n.config.title+" | "+t.title:n.config.title:t.title&&(document.title=t.title)},O.navigate=function(e,t){return e&&-1!=e.indexOf("://")?(window.location.href=e,!0):(g.explicitNavigation=!0,o.navigate(e,t))},O.navigateBack=function(){o.navigateBack()},O.attached=function(){setTimeout(function(){C(!1),O.trigger("router:navigation:attached",D,V,O),I()},10)},O.compositionComplete=function(){O.trigger("router:navigation:composition-complete",D,V,O)},O.convertRouteToHash=function(e){if(O.relativeToParentRouter){var t=O.parent.activeInstruction(),n=t.config.hash+"/"+e;return o._hasPushState&&(n="/"+n),n=n.replace("//","/").replace("//","/")}return o._hasPushState?e:"#"+e},O.convertRouteToModuleId=function(e){return l(e)},O.convertRouteToTitle=function(e){var t=l(e);return t.substring(0,1).toUpperCase()+t.substring(1)},O.map=function(t,n){if(e.isArray(t)){for(var i=0;i<t.length;i++)O.map(t[i]);return O}return e.isString(t)||e.isRegExp(t)?(n?e.isString(n)&&(n={moduleId:n}):n={},n.route=t):n=t,A(n)},O.buildNavigationModel=function(t){var n=[],i=O.routes;t=t||100;for(var r=0;r<i.length;r++){var o=i[r];o.nav&&(e.isNumber(o.nav)||(o.nav=t),q(o),n.push(o))}return n.sort(function(e,t){return e.nav-t.nav}),O.navigationModel(n),O},O.mapUnknownRoutes=function(t,n){var i="*catchall",r=s(i);return O.route(r,function(a,u){var s=k(r,a,u),l={fragment:a,queryString:u,config:{route:i,routePattern:r},params:s.params,queryParams:s.queryParams};if(t)if(e.isString(t))l.config.moduleId=t,n&&o.navigate(n,{trigger:!1,replace:!0});else if(e.isFunction(t)){var c=t(l);if(c&&c.then)return c.then(function(){O.trigger("router:route:before-config",l.config,O),O.trigger("router:route:after-config",l.config,O),_(l)}),void 0}else l.config=t,l.config.route=i,l.config.routePattern=r;else l.config.moduleId=a;O.trigger("router:route:before-config",l.config,O),O.trigger("router:route:after-config",l.config,O),_(l)}),O},O.reset=function(){return V=D=void 0,O.handlers=[],O.routes=[],O.off(),delete O.options,O},O.makeRelative=function(t){return e.isString(t)&&(t={moduleId:t,route:t}),t.moduleId&&!d(t.moduleId,"/")&&(t.moduleId+="/"),t.route&&!d(t.route,"/")&&(t.route+="/"),t.fromParent&&(O.relativeToParentRouter=!0),O.on("router:route:before-config").then(function(e){t.moduleId&&(e.moduleId=t.moduleId+e.moduleId),t.route&&(e.route=""===e.route?t.route.substring(0,t.route.length-1):t.route+e.route)}),O},O.createChildRouter=function(){var e=w();return e.parent=O,e},O};return g=w(),g.explicitNavigation=!1,g.navigatingBack=!1,g.activate=function(t){return e.defer(function(n){if(v=n,g.options=e.extend({routeHandler:g.loadUrl},g.options,t),o.activate(g.options),o._hasPushState)for(var i=g.routes,r=i.length;r--;){var a=i[r];a.hash=a.hash.replace("#","")}u(document).delegate("a","click",function(e){if(g.explicitNavigation=!0,o._hasPushState&&!(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)){var t=u(this).attr("href"),n=this.protocol+"//";(!t||"#"!==t.charAt(0)&&t.slice(n.length)!==n)&&(e.preventDefault(),o.navigate(t))}})}).promise()},g.deactivate=function(){o.deactivate()},g.install=function(){a.bindingHandlers.router={init:function(){return{controlsDescendantBindings:!0}},update:function(e,t,n,i,o){var u=a.utils.unwrapObservable(t())||{};if(u.__router__)u={model:u.activeItem(),attached:u.attached,compositionComplete:u.compositionComplete,activate:!1};else{var s=a.utils.unwrapObservable(u.router||i.router)||g;u.model=s.activeItem(),u.attached=s.attached,u.compositionComplete=s.compositionComplete,u.activate=!1}r.compose(e,u,o)}},a.virtualElements.allowedBindings.router=!0},g});
define('services/logger',["durandal/system"],function(e){function t(e,t,n,r){i(e,t,n,r,"info")}function n(e,t,n,r){i(e,t,n,r,"error")}function i(t,n,i,r,o){i=i?"["+i+"] ":"",n?e.log(i,t,n):e.log(i,t),r&&("error"===o?toastr.error(t):toastr.info(t))}var r={log:t,logError:n};return r});
function boot(e,t,n){function i(){e.start().then(function(){toastr.options.positionClass="toast-bottom-right",toastr.options.backgroundpositionClass="toast-bottom-right",toastr.info("Platform: "+e.platform+", lastPage: "+e.lastPage),t.useConvention(),e.lastPage||e.setRoot("viewmodels/shell","entrance")})}require(["services/binding-handlers"]),n.debug(!0),e.title="Hot Towel Mobile",e.configurePlugins({router:!0}),e.usePhonegap=!1,e.usePhonegap?document.addEventListener("deviceready",function(){e.platform=device.platform,i()},!1):(e.platform="web",i()),console.log(e)}require.config({paths:{text:"../Scripts/text",durandal:"../Scripts/durandal",plugins:"../Scripts/durandal/plugins",transitions:"../Scripts/durandal/transitions"}}),define("jquery",[],function(){return jQuery}),define("knockout",ko),define('main',["durandal/app","durandal/viewLocator","durandal/system","plugins/router","services/logger"],boot);
define('viewmodels/details',["services/logger","durandal/composition","durandal/app"],function(e,t,n){function i(){return e.log(o+" View Activated",null,o,!0),!0}function r(){n.lastPage=o,toastr.info("lastPage:"+n.lastPage)}var o="Details",a={activate:i,title:o,deactivate:r,composition:t};return a});
define('viewmodels/home',["services/logger","durandal/app"],function(e,t){function n(){return e.log(r+" View Activated",null,r,!0),!0}function i(){t.lastPage=r,toastr.info("lastPage:"+t.lastPage)}var r="Home",o={activate:n,deactivate:i,title:r};return o});
define('viewmodels/nav',["services/logger"],function(e){function t(){return e.log(title+" View Activated",null,title,!0),!0}var n={activate:t};return n});
define('viewmodels/shell',["durandal/system","plugins/router","services/logger","durandal/app"],function(e,t,n){function i(){return r()}function r(){o("Hot Towel SPA Loaded!",null,!0),t.on("router:route:not-found",function(e){a("No Route Found",e,!0)});var e=[{route:"",moduleId:"home",title:"Home",visible:!1,icon:""},{route:"home",moduleId:"home",title:"Home",visible:!0,icon:"icon icon-white icon-home"},{route:"details",moduleId:"details",title:"Details",visible:!0,icon:"icon icon-white icon-arrow-right"},{route:"details/:id",moduleId:"details",title:"Details/id",visible:!1,icon:""}];return t.makeRelative({moduleId:"viewmodels"}).map(e).buildNavigationModel().activate()}function o(t,i,r){n.log(t,i,e.getModuleId(u),r)}function a(t,i,r){n.logError(t,i,e.getModuleId(u),r)}var u={activate:i,router:t};return u});
define('text',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
define('text!views/details.html',[],function () { return '<section>\r\n    <h2 class="page-title" data-bind="text: title"></h2>\r\n\r\n     <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n\r\n      <p>\r\n        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh \r\n        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad mi\r\n        nim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip\r\n         ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate \r\n        velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros \r\n        et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue \r\n        duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option \r\n        congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non \r\n        habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. \r\n        Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. \r\n        Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. \r\n        Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit \r\n        litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo \r\n        typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.\r\n    </p>\r\n</section>';});

define('text!views/home.html',[],function () { return '<section>\r\n    <h2 class="page-title" data-bind="text: title"></h2>\r\n\r\n    <h3 id="features">Features</h3>\r\n\r\n    <p>\r\n        <a class="btn btn-large btn-primary" type="button" href="https://github.com/ntheile/Hot-Towel-Mobile" target="_blank">Github</a>\r\n        <button onclick="TogetherJS(this); return false;" class="btn btn-large btn-success"  target="_blank">Collaborate</button>\r\n    </p>\r\n    <br />\r\n    <ul>\r\n        <li>Adds Phonegap to Hot Towel for native deployments to Android / iPhone / Blackberry / Windows Phone / etc... so \r\n        you can use native features such as the Camera and deploy your application to the app stores.</li>\r\n        <li>Removes the cshtml dependency and adds a plain index.html page</li>\r\n        <li>Adds a build script in conjuction with Durandal Weyland to output files in a PhoneGap Build format</li>\r\n        <li>The PhoneGapBuild.ps1 script will output the html/css/js in a folder titled \r\n        <code>~\\Desktop\\PhoneGapBuildAppYYYY-MM-DD_HH-MM-SS</code></li>\r\n    </ul>\r\n\r\n    <pre>\r\n        src\r\n        www\r\n            |_App\r\n                |_main-built.js\r\n            |_Content\r\n                |_images\r\n                |_*\r\n            |_Scripts   \r\n                |_Durandal\r\n                |_*\r\n            |_config.xml\r\n            |_index.html\r\n    </pre>\r\n\r\n    <ul>\r\n        <li>Shows an example of pulling in a third party plugin and how to create a custom binding in the \r\n            <code>services\\binding-handlers.js</code> file. </li>\r\n        <li>Uses the <code>jquery.mmenu</code> plugin for navigation </li>\r\n    </ul>\r\n\r\n    <h3 id="tocreateaphonegapbuildapp">To Create a PhoneGap Build App</h3>\r\n\r\n    <ul>\r\n        <li>Review the docs here, https://build.phonegap.com/docs </li>\r\n        <li>To get up and running quickly...simply build the app in release mode then\r\n            run the <code>PhoneGapBuild.ps1</code> and it will output a folder on the desktop.</li>\r\n        <li>Zip the folder up and upload it to https://build.phonegap.com . \r\n            An app will be built and available for download from the site.</li>\r\n    </ul>\r\n\r\n    <h3 id="tocreateappicons">To Create App Icons</h3>\r\n\r\n    <p>\r\n        You can generate Android icons using this <a href="http://android-ui-utils.googlecode.com/hg/asset-studio/dist/icons-launcher.html#foreground.type=image&amp;foreground.space.trim=0&amp;foreground.space.pad=0&amp;foreColor=fff%2C0&amp;crop=1&amp;backgroundShape=none&amp;backColor=fff%2C100" target="_blank">site</a>\r\n        \r\n        Then configure the <code>config.xml</code> to use them in the build\r\n    </p>\r\n\r\n    <h3 id="mmenuplugincustombindinghandler">mmenu plugin - custom binding handler</h3>\r\n\r\n    <p>To get the jquery.mmenu plugin to work, a durandal custom binding handler was created in <br />\r\n    <code>services/binding-handlers.js</code>. This file is loaded at app start in main.js.</p>\r\n\r\n    <pre>\r\n    composition.addBindingHandler(\'mmenu\', {\r\n        init: function (element, valueAccessor, \r\n                    allBindingsAccessor, viewModel) {\r\n            $(\'a#open-icon-menu\').click(function (e) {\r\n                e.stopImmediatePropagation();\r\n                e.preventDefault();\r\n                $(element).trigger(\'toggle.mm\');\r\n            });\r\n            $(element).mmenu();\r\n        }\r\n    });\r\n    </pre>\r\n\r\n</section>';});

define('text!views/nav.html',[],function () { return '<nav id="menu" data-bind="mmenu: {}">\n\t<ul>\n\t\t<li>\n            <a id="open-icon-menu" href="#">\n\t\t\t\t<i class="icon icon-white icon-list"></i>\r\n            </a>\r\n\t\t</li>\n        <!-- ko foreach: router.routes -->\n        <!-- ko if: visible -->\n        <li>\n            \n            <a data-bind="attr: { \'href\': (\'#\' + route) }" >\n\t\t\t\t<i data-bind="attr: { \'class\': icon }"></i>\n\t\t\t\t<span data-bind="text: title"></span>\r\n            </a>\r\n            \r\n\t\t</li>\n        <!-- /ko -->\n        <!-- /ko -->\n\t</ul>\n</nav>';});

define('text!views/shell.html',[],function () { return '<div data-bind="compose: { view: \'nav\' }">\r\n</div>\r\n<div id="page">\n    <div data-bind="compose: { view: \'topbar\' }">\r\n\r\n    </div>\n\t<div id="content" style="padding: 50px 15px 15px 15px;" data-bind="router: { transition: \'entrance\', cacheViews: true }">\n\n\t</div>\n</div>\r\n\r\n';});

define('text!views/topbar.html',[],function () { return '<div class="navbar navbar-fixed-top top-bar">\r\n    <div class="navbar-inner">\r\n        <div class="container">\r\n \r\n            <ul class="nav pull-left" id="open-icon-header">\r\n                <li>\r\n                    <a href="#menu">\r\n                        <i class="icon icon-th-list icon-3x" ></i>\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n \r\n            <!-- Be sure to leave the brand out there if you want it shown -->\r\n        \r\n            <a class="brand" href="#">Hot Towel Mobile</a>\r\n  \r\n            <!-- Everything you want hidden at 940px or less, place within here -->\r\n            <div class="nav-collapse collapse">\r\n            <!-- .nav, .navbar-search, .navbar-form, etc -->\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>';});

define('plugins/dialog',["durandal/system","durandal/app","durandal/composition","durandal/activator","durandal/viewEngine","jquery","knockout"],function(e,t,n,i,r,o,a){function u(t){return e.defer(function(n){e.isString(t)?e.acquire(t).then(function(t){n.resolve(e.resolveObject(t))}).fail(function(n){e.error("Failed to load dialog module ("+t+"). Details: "+n.message)}):n.resolve(t)}).promise()}var s,l={},c=0,d=function(e,t,n){this.message=e,this.title=t||d.defaultTitle,this.options=n||d.defaultOptions};return d.prototype.selectOption=function(e){s.close(this,e)},d.prototype.getView=function(){return r.processMarkup(d.defaultViewMarkup)},d.setViewUrl=function(e){delete d.prototype.getView,d.prototype.viewUrl=e},d.defaultTitle=t.title||"Application",d.defaultOptions=["Ok"],d.defaultViewMarkup=['<div data-view="plugins/messageBox" class="messageBox">','<div class="modal-header">','<h3 data-bind="text: title"></h3>',"</div>",'<div class="modal-body">','<p class="message" data-bind="text: message"></p>',"</div>",'<div class="modal-footer" data-bind="foreach: options">','<button class="btn" data-bind="click: function () { $parent.selectOption($data); }, text: $data, css: { \'btn-primary\': $index() == 0, autofocus: $index() == 0 }"></button>',"</div>","</div>"].join("\n"),s={MessageBox:d,currentZIndex:1050,getNextZIndex:function(){return++this.currentZIndex},isOpen:function(){return c>0},getContext:function(e){return l[e||"default"]},addContext:function(e,t){t.name=e,l[e]=t;var n="show"+e.substr(0,1).toUpperCase()+e.substr(1);this[n]=function(t,n){return this.show(t,n,e)}},createCompositionSettings:function(e,t){var n={model:e,activate:!1};return t.attached&&(n.attached=t.attached),t.compositionComplete&&(n.compositionComplete=t.compositionComplete),n},getDialog:function(e){return e?e.__dialog__:void 0},close:function(e){var t=this.getDialog(e);if(t){var n=Array.prototype.slice.call(arguments,1);t.close.apply(t,n)}},show:function(t,r,o){var a=this,s=l[o||"default"];return e.defer(function(e){u(t).then(function(t){var o=i.create();o.activateItem(t,r).then(function(i){if(i){var r=t.__dialog__={owner:t,context:s,activator:o,close:function(){var n=arguments;o.deactivateItem(t,!0).then(function(i){i&&(c--,s.removeHost(r),delete t.__dialog__,0==n.length?e.resolve():1==n.length?e.resolve(n[0]):e.resolve.apply(e,n))})}};r.settings=a.createCompositionSettings(t,s),s.addHost(r),c++,n.compose(r.host,r.settings)}else e.resolve(!1)})})}).promise()},showMessage:function(t,n,i){return e.isString(this.MessageBox)?s.show(this.MessageBox,[t,n||d.defaultTitle,i||d.defaultOptions]):s.show(new this.MessageBox(t,n,i))},install:function(e){t.showDialog=function(e,t,n){return s.show(e,t,n)},t.showMessage=function(e,t,n){return s.showMessage(e,t,n)},e.messageBox&&(s.MessageBox=e.messageBox),e.messageBoxView&&(s.MessageBox.prototype.getView=function(){return e.messageBoxView})}},s.addContext("default",{blockoutOpacity:.2,removeDelay:200,addHost:function(e){var t=o("body"),n=o('<div class="modalBlockout"></div>').css({"z-index":s.getNextZIndex(),opacity:this.blockoutOpacity}).appendTo(t),i=o('<div class="modalHost"></div>').css({"z-index":s.getNextZIndex()}).appendTo(t);if(e.host=i.get(0),e.blockout=n.get(0),!s.isOpen()){e.oldBodyMarginRight=t.css("margin-right"),e.oldInlineMarginRight=t.get(0).style.marginRight;var r=o("html"),a=t.outerWidth(!0),u=r.scrollTop();o("html").css("overflow-y","hidden");var l=o("body").outerWidth(!0);t.css("margin-right",l-a+parseInt(e.oldBodyMarginRight)+"px"),r.scrollTop(u)}},removeHost:function(e){if(o(e.host).css("opacity",0),o(e.blockout).css("opacity",0),setTimeout(function(){a.removeNode(e.host),a.removeNode(e.blockout)},this.removeDelay),!s.isOpen()){var t=o("html"),n=t.scrollTop();t.css("overflow-y","").scrollTop(n),e.oldInlineMarginRight?o("body").css("margin-right",e.oldBodyMarginRight):o("body").css("margin-right","")}},compositionComplete:function(e,t,n){var i=o(e),r=i.width(),a=i.height(),u=s.getDialog(n.model);i.css({"margin-top":(-a/2).toString()+"px","margin-left":(-r/2).toString()+"px"}),o(u.host).css("opacity",1),o(e).hasClass("autoclose")&&o(u.blockout).click(function(){u.close()}),o(".autofocus",e).each(function(){o(this).focus()})}}),s});
define('plugins/http',["jquery","knockout"],function(e,t){return{callbackParam:"callback",get:function(t,n){return e.ajax(t,{data:n})},jsonp:function(t,n,i){return-1==t.indexOf("=?")&&(i=i||this.callbackParam,t+=-1==t.indexOf("?")?"?":"&",t+=i+"=?"),e.ajax({url:t,dataType:"jsonp",data:n})},post:function(n,i){return e.ajax({url:n,data:t.toJSON(i),type:"POST",contentType:"application/json",dataType:"json"})}}});
define('plugins/observable',["durandal/system","durandal/binder","knockout"],function(e,t,n){function i(e){var t=e[0];return"_"===t||"$"===t}function r(t){if(!t||e.isElement(t)||t.ko===n||t.jquery)return!1;var i=d.call(t);return-1==f.indexOf(i)&&!(t===!0||t===!1)}function a(e,t){var n=e.__observable__,i=!0;if(!n||!n.__full__){n=n||(e.__observable__={}),n.__full__=!0,m.forEach(function(n){e[n]=function(){i=!1;var e=h[n].apply(t,arguments);return i=!0,e}}),v.forEach(function(n){e[n]=function(){i&&t.valueWillMutate();var r=g[n].apply(e,arguments);return i&&t.valueHasMutated(),r}}),p.forEach(function(n){e[n]=function(){for(var r=0,a=arguments.length;a>r;r++)o(arguments[r]);i&&t.valueWillMutate();var u=g[n].apply(e,arguments);return i&&t.valueHasMutated(),u}}),e.splice=function(){for(var n=2,r=arguments.length;r>n;n++)o(arguments[n]);i&&t.valueWillMutate();var a=g.splice.apply(e,arguments);return i&&t.valueHasMutated(),a};for(var r=0,a=e.length;a>r;r++)o(e[r])}}function o(t){var o,u;if(r(t)&&(o=t.__observable__,!o||!o.__full__)){if(o=o||(t.__observable__={}),o.__full__=!0,e.isArray(t)){var l=n.observableArray(t);a(t,l)}else for(var c in t)i(c)||o[c]||(u=t[c],e.isFunction(u)||s(t,c,u));b&&e.log("Converted",t)}}function u(e,t,n){var i;e(t),i=e.peek(),n?i.destroyAll||(i||(i=[],e(i)),a(i,e)):o(i)}function s(t,i,r){var s,l,c=t.__observable__||(t.__observable__={});if(void 0===r&&(r=t[i]),e.isArray(r))s=n.observableArray(r),a(r,s),l=!0;else if("function"==typeof r){if(!n.isObservable(r))return null;s=r}else e.isPromise(r)?(s=n.observable(),r.then(function(t){if(e.isArray(t)){var i=n.observableArray(t);a(t,i),t=i}s(t)})):(s=n.observable(r),o(r));return Object.defineProperty(t,i,{configurable:!0,enumerable:!0,get:s,set:n.isWriteableObservable(s)?function(t){t&&e.isPromise(t)?t.then(function(t){u(s,t,e.isArray(t))}):u(s,t,l)}:void 0}),c[i]=s,s}function l(t,n,i){var r,a=this,o={owner:t,deferEvaluation:!0};return"function"==typeof i?o.read=i:("value"in i&&e.error('For ko.defineProperty, you must not specify a "value" for the property. You must provide a "get" function.'),"function"!=typeof i.get&&e.error('For ko.defineProperty, the third parameter must be either an evaluator function, or an options object containing a function called "get".'),o.read=i.get,o.write=i.set),r=a.computed(o),t[n]=r,s(t,n,r)}var c,d=Object.prototype.toString,f=["[object Function]","[object String]","[object Boolean]","[object Number]","[object Date]","[object RegExp]"],m=["remove","removeAll","destroy","destroyAll","replace"],v=["pop","reverse","sort","shift","splice"],p=["push","unshift"],g=Array.prototype,h=n.observableArray.fn,b=!1;return c=function(e,t){var i,r,a;return e?(i=e.__observable__,i&&(r=i[t])?r:(a=e[t],n.isObservable(a)?a:s(e,t,a))):null},c.defineProperty=l,c.convertProperty=s,c.convertObject=o,c.install=function(e){var n=t.binding;t.binding=function(e,t,i){i.applyBindings&&!i.skipConversion&&o(e),n(e,t)},b=e.logConversion},c});
define('plugins/serializer',["durandal/system"],function(e){return{typeAttribute:"type",space:void 0,replacer:function(e,t){if(e){var n=e[0];if("_"===n||"$"===n)return void 0}return t},serialize:function(t,n){return n=void 0===n?{}:n,(e.isString(n)||e.isNumber(n))&&(n={space:n}),JSON.stringify(t,n.replacer||this.replacer,n.space||this.space)},getTypeId:function(e){return e?e[this.typeAttribute]:void 0},typeMap:{},registerType:function(){var t=arguments[0];if(1==arguments.length){var n=t[this.typeAttribute]||e.getModuleId(t);this.typeMap[n]=t}else this.typeMap[t]=arguments[1]},reviver:function(e,t,n,i){var r=n(t);if(r){var a=i(r);if(a)return a.fromJSON?a.fromJSON(t):new a(t)}return t},deserialize:function(e,t){var n=this;t=t||{};var i=t.getTypeId||function(e){return n.getTypeId(e)},r=t.getConstructor||function(e){return n.typeMap[e]},a=t.reviver||function(e,t){return n.reviver(e,t,i,r)};return JSON.parse(e,a)}}});
define('plugins/widget',["durandal/system","durandal/composition","jquery","knockout"],function(e,t,n,i){function r(e,n){var r=i.utils.domData.get(e,s);r||(r={parts:t.cloneNodes(i.virtualElements.childNodes(e))},i.virtualElements.emptyNode(e),i.utils.domData.set(e,s,r)),n.parts=r.parts}var a={},o={},u=["model","view","kind"],s="durandal-widget-data",l={getSettings:function(t){var n=i.utils.unwrapObservable(t())||{};if(e.isString(n))return{kind:n};for(var r in n)n[r]=-1!=i.utils.arrayIndexOf(u,r)?i.utils.unwrapObservable(n[r]):n[r];return n},registerKind:function(e){i.bindingHandlers[e]={init:function(){return{controlsDescendantBindings:!0}},update:function(t,n,i,a,o){var u=l.getSettings(n);u.kind=e,r(t,u),l.create(t,u,o,!0)}},i.virtualElements.allowedBindings[e]=!0},mapKind:function(e,t,n){t&&(o[e]=t),n&&(a[e]=n)},mapKindToModuleId:function(e){return a[e]||l.convertKindToModulePath(e)},convertKindToModulePath:function(e){return"widgets/"+e+"/viewmodel"},mapKindToViewId:function(e){return o[e]||l.convertKindToViewPath(e)},convertKindToViewPath:function(e){return"widgets/"+e+"/view"},createCompositionSettings:function(e,t){return t.model||(t.model=this.mapKindToModuleId(t.kind)),t.view||(t.view=this.mapKindToViewId(t.kind)),t.preserveContext=!0,t.activate=!0,t.activationData=t,t.mode="templated",t},create:function(e,n,i,r){r||(n=l.getSettings(function(){return n},e));var a=l.createCompositionSettings(e,n);t.compose(e,a,i)},install:function(e){if(e.bindingName=e.bindingName||"widget",e.kinds)for(var t=e.kinds,n=0;n<t.length;n++)l.registerKind(t[n]);i.bindingHandlers[e.bindingName]={init:function(){return{controlsDescendantBindings:!0}},update:function(e,t,n,i,a){var o=l.getSettings(t);r(e,o),l.create(e,o,a,!0)}},i.virtualElements.allowedBindings[e.bindingName]=!0}};return l});
define('transitions/entrance',["durandal/system","durandal/composition","jquery"],function(e,t,n){var i=100,r={marginRight:0,marginLeft:0,opacity:1},o={marginLeft:"",marginRight:"",opacity:"",display:""},a=function(t){return e.defer(function(e){function a(){e.resolve()}function u(){t.keepScrollPosition||n(document).scrollTop(0)}function s(){u(),t.triggerAttach();var e={marginLeft:c?"0":"20px",marginRight:c?"0":"-20px",opacity:0,display:"block"},i=n(t.child);i.css(e),i.animate(r,l,"swing",function(){i.css(o),a()})}if(t.child){var l=t.duration||500,c=!!t.fadeOnly;t.activeView?n(t.activeView).fadeOut(i,s):s()}else n(t.activeView).fadeOut(i,a)}).promise()};return a});
require(["main"]);
}());