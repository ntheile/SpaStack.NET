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
/* Base: http://bitovi.com/blog/2010/06/convert-form-elements-to-javascript-object-literals-with-jquery-formBinder-plugin.html */
(function ($) {
    var radioCheck = /radio|checkbox/i,
		keyBreaker = /[^\[\]]+/g,
		numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

    var isNumber = function (value) {
        if (typeof value == 'number') {
            return true;
        }

        if (typeof value != 'string') {
            return false;
        }

        return value.match(numberMatcher);
    };

    $.fn.extend({
        /**
		 * @parent dom
		 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
		 * @plugin jquery/dom/form_params
		 * @test jquery/dom/form_params/qunit.html
		 * <p>Returns an object of name-value pairs that represents values in a form.
		 * It is able to nest values whose element's name has square brackets. </p>
		 * Example html:
		 * @codestart html
		 * &lt;form>
		 *   &lt;input name="foo[bar]" value='2'/>
		 *   &lt;input name="foo[ced]" value='4'/>
		 * &lt;form/>
		 * @codeend
		 * Example code:
		 * @codestart
		 * $('form').formBinder() //-> { foo:{bar:2, ced: 4} }
		 * @codeend
		 *
		 * @demo jquery/dom/form_params/form_params.html
		 *
		 * @param {Boolean} [convert] True if strings that look like numbers and booleans should be converted.  Defaults to true.
		 * @return {Object} An object of name-value pairs.
		 */
        formBinder: function (obj, convert) {
            if (this[0].nodeName.toLowerCase() == 'form' && this[0].elements) {

                return jQuery(jQuery.makeArray(this[0].elements)).getParams(obj, convert);
            }
            return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(obj, convert);
        },
        getParams: function (obj, convert) {
            var data = obj || {},
				current;

            convert = convert === undefined ? true : convert;

            this.each(function () {
                var el = this,
					type = el.type && el.type.toLowerCase();
                //if we are submit, ignore
                if ((type == 'submit') || !el.name) {
                    return;
                }

                var key = el.name,
					value = $.data(el, "value") || $.fn.val.call([el]),
					isRadioCheck = radioCheck.test(el.type),
					parts = key.match(keyBreaker),
					write = !isRadioCheck || !!el.checked,
					//make an array of values
					lastPart;

                if (convert) {
                    if (isNumber(value)) {
                        value = parseFloat(value);
                    } else if (value === 'true' || value === 'false') {
                        value = Boolean(value);
                    }

                }

                // go through and create nested objects
                current = data;
                for (var i = 0; i < parts.length - 1; i++) {
                    if (!current[parts[i]]) {
                        current[parts[i]] = {};
                    }
                    current = current[parts[i]];
                }
                lastPart = parts[parts.length - 1];

                //now we are on the last part, set the value
                if (lastPart in current && type === "checkbox") {
                    if (!$.isArray(current[lastPart])) {
                        current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
                    }
                    if (write) {
                        current[lastPart].push(value);
                    }
                } else if (write || !current[lastPart]) {
                    current[lastPart] = write ? value : undefined;
                }

            });
            return data;
        }
    });
})(jQuery);