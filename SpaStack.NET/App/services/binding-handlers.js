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

     

    });