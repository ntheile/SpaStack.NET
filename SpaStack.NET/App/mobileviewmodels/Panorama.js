define(['services/dbmobile'], function(db){
    return {
        title: "Online restaurant",
        items: [
            {
                header: "Main courses",
                text: "Main courses",
                images: db.food.mainCourses
            },
            {
                header: "Seafood",
                text: "Seafood",
                images: db.food.seafood
            },
            {
                header: "Desserts",
                text: "Desserts",
                images: db.food.desserts
            },
            {
                header: "Drinks",
                text: "Drinks",
                images: db.food.drinks
            }
        ]
    };
});
   