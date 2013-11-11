SpaStack.NET
=================

Demo: ....

SpaStack.NET is a Single Page Application (SPA) boilerplate framework built off Hot Towel that allows you to maintain one 
codebase for native deployments to Android / iPhone / Blackberry / Windows Phone / Browsers / Windows 8 / etc...
It uses the following frameworks:

**Frontend**

* JayData.js – rich data management
* Durandal.js – navigation, app life cycle and View composition
* Knockout.js – data bindings
* Require.js – Modularity with AMD and optimization
* Toastr.js – pop-up messages
* Twitter Bootstrap – robust CSS styling
* Phonegap - Interacting with native mobile/tablet API's in javascript
* jQuery - DOM
* jQuery.mmenu - responsive side menu

**Backend** 

* ASP.NET MVC
* ASP.NET Web API
* ASP.NET Web Optimization – bundling and minification
* ASP.NET with breeze controllers (OData, paging, filtering, yumm )



![Screenshot](HotTowelMobile/Content/images/readme.png)


Features
---------
* Responsive design
* Adds Phonegap to Hot Towel for native deployments to Android / iPhone / Blackberry / Windows Phone / etc... so 
you can use native features such as the Camera and deploy your application to the app stores.
* Removes the cshtml dependency and adds a plain index.html page
* Adds a build script in conjuction with Durandal Weyland to output files in a PhoneGap Build format
* The PhoneGapBuild.ps1 script will output the html/css/js in a folder titled 
`~\Desktop\PhoneGapBuildAppYYYY-MM-DD_HH-MM-SS`
<pre>
	src
	www
		|_App
			|_main-built.js
		|_Content
			|_images
			|_*
		|_Scripts	
			|_Durandal
			|_*
		|_config.xml
		|_index.html
</pre>
* Shows an example of pulling in a third party plugin and how to create a custom binding in the `services\binding-handlers.js` file. 
* Uses the `jquery.mmenu` plugin for navigation 

To Create a PhoneGap Build App
--------------------------------
1. Review the docs here, https://build.phonegap.com/docs 
2. To get up and running quickly...simply build the app in `test` mode so weyland will build and minify the js together
3. Then reference `main-built.js` in your index.html. 
4. If you use github then simply push the code up and reference your repo on the phonegap build site. If not, you can run the 
`PhoneGapBuild.ps1` and it will output a folder on the desktop. You can manually Zip this folder and 
upload to https://build.phonegap.com . 
5. An app will be built and available for download from the Phonegap Build site.

To Create App Icons
-------------------
You can generate Android icons using this site http://android-ui-utils.googlecode.com/hg/asset-studio/dist/icons-launcher.html#foreground.type=image&foreground.space.trim=0&foreground.space.pad=0&foreColor=fff%2C0&crop=1&backgroundShape=none&backColor=fff%2C100
Then configure the `config.xml` to use them in the build


Custom binding handler - mmenu plugin 
-------------------------------------
To get the jquery.mmenu plugin to work, a durandal custom binding handler was created in  
`services/binding-handlers.js`. This file is loaded at app start in main.js.

<pre>
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
</pre>
