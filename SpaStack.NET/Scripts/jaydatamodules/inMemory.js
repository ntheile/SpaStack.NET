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

    $data.Array.prototype.toQueryable = function () {
        if (this.length > 0) {
            var firtsItem = this[0];
            var type = Container.resolveType(Container.getTypeName(firtsItem));

            if (!type.isAssignableTo || !type.isAssignableTo($data.Entity))
                Guard.raise(new Exception("Type '" + Container.resolveName(type) + "' is not subclass of $data.Entity", "Not supported", type));

            for (var i = 0; i < this.length; i++) {
                Guard.requireType('array item check', this[i], type);
            }

        }

        var typeName = 'inMemoryArray_' + type.name;
        if (!Container.isTypeRegistered(typeName)) {
            $data.EntityContext.extend(typeName, {
                Source: {
                    type: $data.EntitySet,
                    elementType: type
                }
            });
        }

        var context = Container['create' + typeName]({ name: 'InMemory', source: { Source: this} });

        return context.Source;
    }

})($data);