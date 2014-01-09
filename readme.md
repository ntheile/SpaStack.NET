﻿SpaStack.NET
=================


> SpaStack.NET is a Single Page Application (SPA) web boilerplate framework built from `Durandal.js` `JayData.js` `ASP.NET Web API 2 oData` `Twitter Bootstrap` . It allows you to maintain one slim
> codebase . It be package with PhoneGap for native deployments to Android / iPhone / Blackberry / Windows Phone / Browsers / Windows 8 / etc... It follows `RESTful OData MVC` patterns on the server side
> and `MVVM` patterns in the client side.

> **Examples of desireable things SpaStack can do:**
> * Code organization and separation of concerns for large scale javascript development using AMD patterns and best practices such as the revealing module pattern
> * Table and Data Paging using the OData spec
> * Validation
> * Async Promises
> * Login (local, facebook, twitter, etc...)
> * Offline - IndexedDB, WebSql, LocalStorage providers
> * $expand OData REST entities
> * MVVM data-bind to observables in your view
> * Dashboards - charting, graphing, grids, forms (uses startbootstrap's dashboard template http://startbootstrap.com/sb-admin)

`Desktop View`
![Screenshot](/SpaStack.NET/Content/images/SPAStack.PNG)

`Mobile View`
![Screenshot](/SpaStack.NET/Content/images/SpaStackMobile.PNG)

Build an app in 1 line of code 
-------------------------------
> maybe a few more ;)

1.Create the `server side model` (C#)

```csharp

	public class TodoItem
	{
		[Key]
		public Guid Id { get; set; }
		public String Task { get; set; }
		public Boolean Completed { get; set; }
		public Boolean InSync { get; set; }    
	}

```

2.Create a `Web Api 2 oData Rest Controller` and use `Entity Framework Code first` to create the database

3.Run the Jay Data Service utility to auto create the client side model (JS)
`JaySvcUtil.exe -m http://localhost:65310/odata/$metadata -o App\services\db.js`

```js

	/*//////////////////////////////////////////////////////////////////////////////////////
	////// Autogenerated by JaySvcUtil.exe http://JayData.org for more info        /////////
	//////                             oData  V3                                     /////////
	//////////////////////////////////////////////////////////////////////////////////////*/
	$data.Entity.extend('SpaStack.NET.Models.TodoItem', {
		'Id': { 'key':true,'type':'Edm.Guid','nullable':false,'required':true },
		'Task': { 'type':'Edm.String' },
		'Completed': { 'type':'Edm.Boolean','nullable':false,'required':true },
		'InSync': { 'type':'Edm.Boolean','nullable':false,'required':true }
	});
	$data.EntityContext.extend('MyDb', {
		'TodoItem': { type: $data.EntitySet, elementType: SpaStack.NET.Models.TodoItem}
	});

	$data.generatedContexts = $data.generatedContexts || [];
	$data.generatedContexts.push(MyDb);

```

4.Wire up a `data context` instance on your client (JS)

```js

	var db = new MyDb({
		name: 'oData',
		oDataServiceHost: '/odata'
	});

```

5.Consume the data and display it using a knockout observableArray (JS)

```js

	var remoteTodos = new ko.observableArray();
	var promise = datacontext.db.TodoItem.toArray(remoteTodos);

```

```html

	<table class="table table-striped">
		<thead>
			<tr>
				<th>Task</th>
				<th>Is Synchronized</th>
			</tr>
		</thead>
		<tbody data-bind="foreach: remoteTodos">
			<tr>
				<td contenteditable="true" data-bind="text: Task"></td>
				<td data-bind="text: InSync"></td>
			</tr>
		</tbody>
	</table>

```

It uses the following frameworks:
--------------------------------

Frontend
--------

> * JayData.js – rich data management
> * Durandal.js – navigation, app life cycle and View composition
> * Knockout.js – data bindings
> * Require.js – Modularity with AMD and optimization
> * Toastr.js – pop-up messages
> * Twitter Bootstrap – robust CSS styling
> * Phonegap - Interacting with native mobile/tablet API's in javascript
> * jQuery - DOM
> * jQuery.mmenu - responsive side menu

Backend
-------

> ASP.NET Web API 2 oData Service



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


To create a Custom binding handler for durandal/knockout
----------------------------------------------------
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


Automated Builds with Weyland
------------------------------
Features

* JS Linting
* JS Minification
* RequireJS Optimization

Usage

* Install NodeJS and NPM
* On the command line execute npm install -g weyland
* Navigate into your web project and place a weyland-config file at the root.
* From your project directory execute weyland build


Autogenerate appcache manifest with Fiddler
--------------------------------------------

http://blogs.msdn.com/b/fiddler/archive/2011/09/15/generate-html5-appcache-manifests-using-fiddler-export.aspx


OAuth
-------
I added the Individual user account authenication built into ASP.NET. I login simple hit the `/login` route. 
After you are authenicated you will be redirected to `index.html` from there you are passed a token that can be consumed like this 
(the part after Bearer is your token):

```
GET http://localhost:65310/api/Account/UserInfo HTTP/1.1
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Host: localhost:65310
Authorization: Bearer 9P1pkFVc5rDBikSxyCuvgr_T8L7oR0lok5SdryBF4yDU5jj21sO_d-gAStm_YdZHNp8N_gIWc8kklTrydHRVI_FjeXhD66allUjw2XO1fc
```




TODO
----
* add testing with Jasmine
* Add /v1/odata route (http://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2)
* Separate admin routes from normal user routes
	* user route -  /v1/odata/TodoItems (lock down filtering where uid using this http://www.asp.net/web-api/overview/odata-support-in-aspnet-web-api/odata-security-guidance)
	<pre>
	```csharp
		// Validator to restrict which properties can be used in $filter expressions.
		public class MyFilterQueryValidator : FilterQueryValidator
		{
			static readonly string[] allowedProperties = { "ReleaseYear", "Title" };

			public override void ValidateSingleValuePropertyAccessNode(
				SingleValuePropertyAccessNode propertyAccessNode,
				ODataValidationSettings settings)
			{
				string propertyName = null;
				if (propertyAccessNode != null)
				{
					propertyName = propertyAccessNode.Property.Name;
				}

				if (propertyName != null && !allowedProperties.Contains(propertyName))
				{
					throw new ODataException(
						String.Format("Filter on {0} not allowed", propertyName));
				}
				base.ValidateSingleValuePropertyAccessNode(propertyAccessNode, settings);
			}
		}
	```
	</pre>
	* admin route - /v1/odata/admin/TodoItem
