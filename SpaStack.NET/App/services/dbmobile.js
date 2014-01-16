define([], function(){

    var products = ["Spegesild", "Rogede sild", "Röd Kaviar", "Nord-Ost Matjeshering", "Konbu", "Jack's New England Clam Chowder", "Inlagd Sill",
                    "Ikura", "Guaraná Fantástica", "Gravad lax", "Escargots de Bourgogne", "Carnarvon Tigers", "Boston Crab Meat", "Uncle Bob's Organic Dried Pears",
                    "Tofu", "Rössle Sauerkraut", "Manjimup Dried Apples", "Longlife Tofu", "Tourtière", "Thüringer Rostbratwurst", "Perth Pasties", "Pâté chinois",
                    "Mishi Kobe Niku", "Alice Mutton", "Wimmers gute Semmelknödel", "Tunnbröd", "Singaporean Hokkien Fried Mee", "Ravioli Angelo", "Gustaf's Knäckebröd",
                    "Gnocchi di nonna Alice", "Filo Mix", "Steeleye Stout", "Sasquatch Ale", "Raclette Courdavault", "Queso Manchego La Pastora", "Mozzarella di Giovanni",
                    "Mascarpone Fabioli", "Gudbrandsdalsost", "Gorgonzola Telino", "Geitost", "Flotemysost", "Chai", "Camembert Pierrot", "Zaanse koeken", "Valkoinen suklaa",
                    "Teatime Chocolate Biscuits", "Tarte au sucre", "Sir Rodney's Scones", "Sir Rodney's Marmalade", "Scottish Longbreads", "Schoggi Schokolade", "Pavlova",
                    "NuNuCa Nuß-Nougat-Creme", "Maxilaku", "Gumbär Gummibärchen", "Chocolade", "Chang", "Aniseed Syrup", "Rhönbräu Klosterbier", "Outback Lager",
                    "Laughing Lumberjack Lager", "Lakkalikööri", "Ipoh Coffee", "Côte de Blaye", "Chartreuse verte"];
    var productsCustom = [
        { Name: products[0], Price: 0.99, Image: "content/images/products/46.jpg" },
        { Name: products[1], Price: 1.50, Image: "content/images/products/45.jpg" },
        { Name: products[2], Price: 0.99, Image: "content/images/products/73.jpg" },
        { Name: products[3], Price: 1.59, Image: "content/images/products/30.jpg" },
        { Name: products[4], Price: 1.30, Image: "content/images/products/13.jpg" },
        { Name: products[5], Price: 0.99, Image: "content/images/products/41.jpg" },
        { Name: products[6], Price: 2.50, Image: "content/images/products/36.jpg" },
        { Name: products[7], Price: 1.20, Image: "content/images/products/10.jpg" },
        { Name: products[8], Price: 2.15, Image: "content/images/products/24.jpg" },
        { Name: products[9], Price: 0.99, Image: "content/images/products/37.jpg" },
        { Name: products[10], Price: 3.20, Image: "content/images/products/58.jpg" },
        { Name: products[11], Price: 1.99, Image: "content/images/products/18.jpg" },
        { Name: products[12], Price: 2.99, Image: "content/images/products/40.jpg" },
        { Name: products[13], Price: 1.30, Image: "content/images/products/07.jpg" },
        { Name: products[14], Price: 1.25, Image: "content/images/products/14.jpg" },
        { Name: products[15], Price: 2.99, Image: "content/images/products/28.jpg" },
        { Name: products[16], Price: 1.99, Image: "content/images/products/51.jpg" },
        { Name: products[17], Price: 0.99, Image: "content/images/products/74.jpg" },
        { Name: products[18], Price: 2.75, Image: "content/images/products/54.jpg" },
        { Name: products[19], Price: 1.75, Image: "content/images/products/29.jpg" },
        { Name: products[20], Price: 1.25, Image: "content/images/products/53.jpg" },
        { Name: products[21], Price: 0.75, Image: "content/images/products/55.jpg" },
        { Name: products[22], Price: 2.20, Image: "content/images/products/09.jpg" },
        { Name: products[23], Price: 1.30, Image: "content/images/products/17.jpg" },
        { Name: products[24], Price: 0.99, Image: "content/images/products/64.jpg" },
        { Name: products[25], Price: 1.20, Image: "content/images/products/23.jpg" },
        { Name: products[26], Price: 2.10, Image: "content/images/products/42.jpg" },
        { Name: products[27], Price: 0.99, Image: "content/images/products/57.jpg" },
        { Name: products[28], Price: 2.99, Image: "content/images/products/22.jpg" },
        { Name: products[29], Price: 1.99, Image: "content/images/products/56.jpg" },
        { Name: products[30], Price: 2.70, Image: "content/images/products/52.jpg" },
        { Name: products[31], Price: 1.59, Image: "content/images/products/35.jpg" },
        { Name: products[32], Price: 2.99, Image: "content/images/products/34.jpg" },
        { Name: products[33], Price: 2.99, Image: "content/images/products/59.jpg" },
        { Name: products[34], Price: 1.99, Image: "content/images/products/12.jpg" },
        { Name: products[35], Price: 2.30, Image: "content/images/products/72.jpg" },
        { Name: products[36], Price: 0.99, Image: "content/images/products/32.jpg" },
        { Name: products[37], Price: 1.20, Image: "content/images/products/69.jpg" },
        { Name: products[38], Price: 3.00, Image: "content/images/products/31.jpg" },
        { Name: products[39], Price: 1.20, Image: "content/images/products/33.jpg" },
        { Name: products[40], Price: 2.99, Image: "content/images/products/71.jpg" },
        { Name: products[41], Price: 2.99, Image: "content/images/products/01.jpg" },
        { Name: products[42], Price: 1.99, Image: "content/images/products/60.jpg" },
        { Name: products[43], Price: 2.40, Image: "content/images/products/47.jpg" },
        { Name: products[44], Price: 1.45, Image: "content/images/products/50.jpg" },
        { Name: products[45], Price: 3.10, Image: "content/images/products/19.jpg" },
        { Name: products[46], Price: 1.99, Image: "content/images/products/62.jpg" },
        { Name: products[47], Price: 2.99, Image: "content/images/products/21.jpg" },
        { Name: products[48], Price: 2.20, Image: "content/images/products/20.jpg" },
        { Name: products[49], Price: 1.30, Image: "content/images/products/68.jpg" },
        { Name: products[50], Price: 2.99, Image: "content/images/products/27.jpg" },
        { Name: products[51], Price: 0.99, Image: "content/images/products/16.jpg" },
        { Name: products[52], Price: 2.20, Image: "content/images/products/25.jpg" },
        { Name: products[53], Price: 1.30, Image: "content/images/products/49.jpg" },
        { Name: products[54], Price: 2.99, Image: "content/images/products/26.jpg" },
        { Name: products[55], Price: 0.99, Image: "content/images/products/48.jpg" },
        { Name: products[56], Price: 2.99, Image: "content/images/products/02.jpg" },
        { Name: products[57], Price: 3.50, Image: "content/images/products/03.jpg" },
        { Name: products[58], Price: 2.20, Image: "content/images/products/75.jpg" },
        { Name: products[59], Price: 3.00, Image: "content/images/products/70.jpg" },
        { Name: products[60], Price: 1.99, Image: "content/images/products/67.jpg" },
        { Name: products[61], Price: 2.99, Image: "content/images/products/76.jpg" },
        { Name: products[62], Price: 0.99, Image: "content/images/products/43.jpg" },
        { Name: products[63], Price: 1.50, Image: "content/images/products/38.jpg" },
        { Name: products[64], Price: 2.30, Image: "content/images/products/39.jpg" }
    ];
    var productsGrouped = [
        {
            key: "Group 1",
            items: products.slice(0, 10)
        },
        {
            key: "Group 2",
            items: products.slice(11, 21)
        },
        {
            key: "Group 3",
            items: products.slice(22, 33)
        },
        {
            key: "Group 4",
            items: products.slice(34, 45)
        },
        {
            key: "Group 5",
            items: products.slice(46, 64)
        }
    ];
    var food = {
        desserts: [
            { src: "content/images/products/06.jpg" },
            { src: "content/images/products/16.jpg" },
            { src: "content/images/products/19.jpg" },
            { src: "content/images/products/21.jpg" },
            { src: "content/images/products/22.jpg" },
            { src: "content/images/products/25.jpg" },
            { src: "content/images/products/26.jpg" },
            { src: "content/images/products/27.jpg" },
            { src: "content/images/products/32.jpg" },
            { src: "content/images/products/47.jpg" },
            { src: "content/images/products/48.jpg" },
            { src: "content/images/products/50.jpg" }
        ],
        mainCourses: [
            { src: "content/images/products/04.jpg" },
            { src: "content/images/products/05.jpg" },
            { src: "content/images/products/14.jpg" },
            { src: "content/images/products/17.jpg" },
            { src: "content/images/products/23.jpg" },
            { src: "content/images/products/28.jpg" },
            { src: "content/images/products/42.jpg" },
            { src: "content/images/products/56.jpg" },
            { src: "content/images/products/57.jpg" },
            { src: "content/images/products/74.jpg" },
            { src: "content/images/products/46.jpg" },
            { src: "content/images/products/09.jpg" }
        ],
        seafood: [
            { src: "content/images/products/46.jpg" },
            { src: "content/images/products/45.jpg" },
            { src: "content/images/products/73.jpg" },
            { src: "content/images/products/30.jpg" },
            { src: "content/images/products/13.jpg" },
            { src: "content/images/products/41.jpg" },
            { src: "content/images/products/36.jpg" },
            { src: "content/images/products/10.jpg" },
            { src: "content/images/products/37.jpg" },
            { src: "content/images/products/58.jpg" },
            { src: "content/images/products/18.jpg" },
            { src: "content/images/products/40.jpg" }
        ],
        drinks: [
            { src: "content/images/products/01.jpg" },
            { src: "content/images/products/02.jpg" },
            { src: "content/images/products/24.jpg" },
            { src: "content/images/products/34.jpg" },
            { src: "content/images/products/35.jpg" },
            { src: "content/images/products/38.jpg" },
            { src: "content/images/products/39.jpg" },
            { src: "content/images/products/43.jpg" },
            { src: "content/images/products/67.jpg" },
            { src: "content/images/products/70.jpg" },
            { src: "content/images/products/75.jpg" },
            { src: "content/images/products/76.jpg" }
        ]
    };
    var contacts = [
        { name: "Barbara J. Coggins", phone: "512-964-2757", email: "BarbaraJCoggins@rhyta.com", category: "Family" },
        { name: "Carol M. Das", phone: "360-684-1334", email: "CarolMDas@jourrapide.com", category: "Friends" },
        { name: "Janet R. Skinner", phone: "520-573-7903", email: "JanetRSkinner@jourrapide.com", category: "Work" },
        { name: "Michael A. Blevins", phone: "530-480-1961", email: "MichaelABlevins@armyspy.com", category: "Favorites" },
        { name: "Jane K. Hernandez", phone: "404-781-0805", email: "JaneKHernandez@teleworm.us", category: "Friends" },
        { name: "Kim D. Thomas", phone: "603-583-9043", email: "KimDThomas@teleworm.us", category: "Work" },
        { name: "Angel H. Padgett", phone: "772-766-2842", email: "AngelHPadgett@jourrapide.com", category: "Family" },
        { name: "Donald L. Jordan", phone: "213-812-8400", email: "DonaldLJordan@dayrep.com", category: "Friends" },
        { name: "Barbara M. Roberts", phone: "614-365-7945", email: "BarbaraMRoberts@armyspy.com", category: "Friends" },
        { name: "Leslie S. Alcantara", phone: "313-881-9719", email: "LeslieSAlcantara@teleworm.us", category: "Work" },
        { name: "Chad S. Miles", phone: "269-718-9780", email: "ChadSMiles@rhyta.com", category: "Friends" },
        { name: "Sherryl C. Flowers", phone: "919-469-3285", email: "SherrylCFlowers@armyspy.com", category: "Friends" },
        { name: "Merle L. Stearns", phone: "213-995-1064", email: "MerleLStearns@jourrapide.com", category: "Friends" },
        { name: "Nicole A. Rios", phone: "240-416-4329", email: "NicoleARios@armyspy.com", category: "Friends" },
        { name: "James L. Parker", phone: "949-265-2198", email: "JamesLParker@teleworm.us", category: "Friends" },
        { name: "Erin G. Goodson", phone: "425-208-5408", email: "ErinGGoodson@rhyta.com", category: "Friends" },
        { name: "Lelia J. Stewart", phone: "580-302-0390", email: "LeliaJStewart@rhyta.com", category: "Family" },
        { name: "Debra B. Abbott", phone: "806-675-3359", email: "DebraBAbbott@jourrapide.com", category: "Work" },
        { name: "Sandra M. Perez", phone: "586-920-6315", email: "SandraMPerez@dayrep.com", category: "Friends" },
        { name: "Elaine R. Coats", phone: "262-397-2323", email: "ElaineRCoats@rhyta.com", category: "Friends" },
        { name: "Theodore P. Thompson", phone: "917-405-5137", email: "TheodorePThompson@dayrep.com", category: "Friends" },
        { name: "Deborah K. Epperson", phone: "501-858-6956", email: "DeborahKEpperson@dayrep.com", category: "Work" },
        { name: "Steven L. Ramos", phone: "920-703-9974", email: "StevenLRamos@dayrep.com", category: "Work" },
        { name: "Herbert S. Livingston", phone: "208-642-4758", email: "HerbertSLivingston@armyspy.com", category: "Work" },
        { name: "Christopher N. Smith", phone: "847-939-9380", email: "ChristopherNSmith@armyspy.com", category: "Work" },
        { name: "Charley D. Pryor", phone: "240-752-1933", email: "CharleyDPryor@rhyta.com", category: "Family" },
        { name: "Douglas D. Thompson", phone: "706-846-1127", email: "DouglasDThompson@rhyta.com", category: "Friends" },
        { name: "Freddie G. Thomas", phone: "661-378-8737", email: "FreddieGThomas@teleworm.us", category: "Friends" },
        { name: "Michael S. Duncan", phone: "608-541-2107", email: "MichaelSDuncan@dayrep.com", category: "Work" },
        { name: "Alberta D. Mui", phone: "503-267-4837", email: "AlbertaDMui@armyspy.com", category: "Friends" },
        { name: "Mary J. Vos", phone: "407-946-7278", email: "MaryJVos@armyspy.com", category: "Family" },
        { name: "Theresa R. Barham", phone: "260-225-0475", email: "TheresaRBarham@dayrep.com", category: "Friends" },
        { name: "Lewis C. Watson", phone: "440-919-4997", email: "LewisCWatson@dayrep.com", category: "Family" },
        { name: "Margaret T. Anderson", phone: "815-957-8935", email: "MargaretTAnderson@armyspy.com", category: "Work" },
        { name: "Kimberly A. Combs", phone: "302-265-0294", email: "KimberlyACombs@jourrapide.com", category: "Work" },
        { name: "Carolyn F. Lebrun", phone: "541-494-7538", email: "CarolynFLebrun@teleworm.us", category: "Family" },
        { name: "Patricia B. Flannagan", phone: "317-725-0796", email: "PatriciaBFlannagan@armyspy.com", category: "Work" },
        { name: "Rebecca H. Downard", phone: "940-862-8492", email: "RebeccaHDownard@teleworm.us", category: "Work" },
        { name: "James J. Rosenberg", phone: "815-905-3483", email: "JamesJRosenberg@dayrep.com", category: "Friends" },
        { name: "Geraldine C. Mager", phone: "715-616-4858", email: "GeraldineCMager@jourrapide.com", category: "Work" },
        { name: "Lonnie E. Snider", phone: "718-359-1962", email: "LonnieESnider@teleworm.us", category: "Friends" }
    ];
    var cities = [
        "New York", "Los Angeles", "Chicago", "Houston", "Philadelphia", "Phoenix", "San Antonio",
        "San Diego", "Dallas", "San Jose", "Jacksonville", "Indianapolis", "Austin", "San Francisco",
        "Columbus", "Fort Worth", "Charlotte", "Detroit", "El Paso", "Memphis", "Boston", "Seattle",
        "Denver", "Baltimore", "Washington", "Nashville", "Louisville", "Milwaukee", "Portland", "Oklahoma"
    ];
    var gallery = [
            { src: "Content/images/gallery/boats.jpg" },
            { src: "Content/images/gallery/cherry.jpg" },
            { src: "Content/images/gallery/country.jpg" },
            { src: "Content/images/gallery/field.jpg" },
            { src: "Content/images/gallery/headphone.jpg" },
            { src: "Content/images/gallery/keyboard.jpg" },
            { src: "Content/images/gallery/ny.jpg" },
            { src: "Content/images/gallery/orange.jpg" },
            { src: "Content/images/gallery/palms.jpg" },
            { src: "Content/images/gallery/sunrise.jpg" },
            { src: "Content/images/gallery/sunset.jpg" },
            { src: "Content/images/gallery/town.jpg" }
    ];
    var icons = ["Airplane", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "Bookmark", "Box", "Car", "Card", "Cart", "Chart", "Clock", "Close",
                 "Comment", "Doc", "Download", "Edit", "Email", "Event", "Favorites", "Find", "Folder", "Food", "Gift", "Globe", "Group", "Help",
                 "Home", "Image", "Info", "Key", "Like", "Map", "Menu", "Money", "Music", "Percent", "Photo", "Preferences", "Product", "Refresh",
                 "Remove", "Runner", "Save", "Tags", "Tel", "Tips", "Todo", "Toolbox", "User"];
    var db = {
        products: new DevExpress.data.ArrayStore(products),
        productsCustom: new DevExpress.data.ArrayStore(productsCustom),
        productsGrouped: new DevExpress.data.ArrayStore(productsGrouped),
        contacts: new DevExpress.data.ArrayStore(contacts),
        gallery: new DevExpress.data.ArrayStore(gallery),
        food: food,
        cities: cities,
        icons: icons
    };

    return db;

});

