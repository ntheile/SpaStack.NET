define(['durandal/system', 'durandal/composition'],
    function (system, composition) {


        composition.addBindingHandler('mmenu', {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                $('a#open-icon-menu').click(function (e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    $(element).trigger('toggle.mm');
                });
                $(element).mmenu();

            }
        });




        // custom ko sort 
        ko.sortedObservableArray = function (sortComparator, initialValues) {
            if (arguments.length < 2) {
                initialValues = [];
            }
            var result = ko.observableArray(initialValues);
            ko.utils.extend(result, ko.sortedObservableArray.fn);
            delete result.unshift;
            result.sort(sortComparator);
            return result;
        };

        ko.sortedObservableArray.fn = {
            push: function (values) {
                if (!$.isArray(values)) {
                    values = [values];
                }
                var underlyingArray = this.peek();
                this.valueWillMutate();
                underlyingArray.push.apply(underlyingArray, values);
                underlyingArray.sort(this.sortComparator);
                this.valueHasMutated();
            },
            sort: function (sortComparator) {
                var underlyingArray = this.peek();
                this.valueWillMutate();
                this.sortComparator = sortComparator;
                underlyingArray.sort(this.sortComparator);
                this.valueHasMutated();
            },
            reinitialise: function (values) {
                if (!$.isArray(values)) {
                    values = [values];
                }
                var underlyingArray = this.peek();
                this.valueWillMutate();
                underlyingArray.splice(0, underlyingArray.length);
                underlyingArray.push.apply(underlyingArray, values);
                underlyingArray.sort(this.sortComparator);
                this.valueHasMutated();
            },
            reverse: function () {
                var underlyingArrayClone = this.peek().slice();
                underlyingArrayClone.reverse();
                return underlyingArrayClone;
            }
        };

     

    });