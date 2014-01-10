// Run these commands to update the database schemas when you modify a model
// Add-Migration FirstComment
// Update-Database

// to get the sql script to push to prod db's
// Update-Database -Script -SourceMigration $InitialDatabase

// to get script after model changes have been made
// Update-Database -Script -SourceMigration:InitialCreate -TargetMigration:"FirstComment"
namespace SpaStack.NET.Migrations
{
    using SpaStack.NET.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SpaStack.NET.Models.MyDBContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(SpaStack.NET.Models.MyDBContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //



            context.TodoItems.AddOrUpdate(
              p => p.Task,
              new TodoItem { Id = Guid.NewGuid(), Completed = true, InSync = true, Task = "Wash the car" },
              new TodoItem { Id = Guid.NewGuid(), Completed = true, InSync = true, Task = "Walk the dog" }
            );

            context.Suppliers.AddOrUpdate(
                s => s.Name,
                new Supplier { Name = "Walmart" }
            );

            context.Categories.AddOrUpdate(
              c => c.Name,
              new Category { Name = "Home" },
              new Category { Name = "Garden" }
          );

            context.Products.AddOrUpdate(
                p => p.Name,
                new Product { Name="Rug", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Lamp", Price  = new decimal(22.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Clock", Price  = new decimal(32.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Flower", Price  = new decimal(2.99) , CategoryId = 2, SupplierId = 1 },
                new Product { Name="Chair", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Desk", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Seeds", Price  = new decimal(12.99) , CategoryId = 2, SupplierId = 1 },
                new Product { Name="Radio", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Keg", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Beer", Price  = new decimal(12.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Pool Table", Price  = new decimal(567.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Hot Tub", Price  = new decimal(5212.99) , CategoryId = 1, SupplierId = 1 },
                new Product { Name="Hoe", Price  = new decimal(12.99) , CategoryId = 2, SupplierId = 1 }
            );


        }
    }
}
