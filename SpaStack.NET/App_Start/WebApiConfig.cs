using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Web.Http.OData.Builder;
using SpaStack.NET.Models;
using Microsoft.Data.Edm;
using SpaStack.NET.App_Start;
using System.Web.Http.OData.Builder;
using SpaStack.NET.Models;


namespace SpaStack.NET
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            // JayData config for $metadata
            // /odata/$metadata
            // http://blogs.msdn.com/b/webdev/archive/2013/01/29/getting-started-with-asp-net-webapi-odata-in-3-simple-steps.aspx
            // http://jaydata.org/blog/how-to-use-jaydata-with-asp.net-web-api---i
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();          
            builder.EntitySet<TodoItem>("TodoItems");
            builder.EntitySet<Category>("Categories");
            builder.EntitySet<Product>("Products");
            builder.EntitySet<Supplier>("Suppliers"); 
            
            //
            // TODO Put your create models here
            //

            config.Routes.MapODataRoute(
                "OData", 
                "odata", 
                builder.GetEdmModel(),
                batchHandler: new PathFixODataBatchHandler(GlobalConfiguration.DefaultServer)
            );

            config.EnableQuerySupport();
            

        }
    }
}
