define(['services/dbmobile'], function(db){
    var contacts = db.contacts;
    return {
        items: [
            {
                title: "All",
                text: "All",
                items: new DevExpress.data.DataSource({ store: contacts, sort: "name" })
            },
            {
                title: "Family",
                text: "Family",
                items: new DevExpress.data.DataSource({ store: contacts, sort: "name", filter: ["category", "=", "Family"] })
            },
            {
                title: "Friends",
                text: "Friends",
                items: new DevExpress.data.DataSource({ store: contacts, sort: "name", filter: ["category", "=", "Friends"] })
            },
            {
                title: "Work",
                text: "Work",
                items: new DevExpress.data.DataSource({ store: contacts, sort: "name", filter: ["category", "=", "Work"] })
            }
        ]
    };
});
   