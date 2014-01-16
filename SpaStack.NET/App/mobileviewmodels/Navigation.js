define([], function () {

    var viewModel = {
        navbar: {
            currentImage: ko.observable("./content/images/navigation/icon-home.png"),
            itemClickAction: function (e) {
                this.navbar.currentImage(e.itemData.image);
            },
            items: [
                { text: "Home", icon: "home", image: "./content/images/navigation/icon-home.png" },
                { text: "User", icon: "user", image: "./content/images/navigation/icon-user.png" },
                { text: "Comment", icon: "comment", image: "./content/images/navigation/icon-message.png" },
                { text: "Photo", icon: "photo", image: "./content/images/navigation/icon-image.png" }
            ],
            selectedIndex: ko.observable(0)
        }
    };
    return viewModel;
    

});
   