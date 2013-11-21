using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SpaStack.NET.Models
{
    public class MyDBContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public MyDBContext() : base("name=MyDBContext")
        {
        }

        public System.Data.Entity.DbSet<SpaStack.NET.Models.TodoItem> TodoItems { get; set; }

        public System.Data.Entity.DbSet<SpaStack.NET.Models.Category> Categories { get; set; }

        public System.Data.Entity.DbSet<SpaStack.NET.Models.Supplier> Suppliers { get; set; }

        public System.Data.Entity.DbSet<SpaStack.NET.Models.Product> Products { get; set; }
    
    }
}
