define(['services/dbmobile'], function(db){
    var icons = $.map(db.icons, function (name) {
        return {
            name: name,
            cssClass: "dx-icon-" + name.toLowerCase()
        };
    });

    return {
        icons: icons
    };
});
  