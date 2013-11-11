// Run these commands to update the database schemas when you modify a model
// Add-Migration 201302041652147_AddUserRole
// Update-Database

// to get the sql script to push to prod db's
// Update-Database -Script -SourceMigration $InitialDatabase

// to get script after model changes have been made
// Update-Database -Script -SourceMigration:InitialCreate -TargetMigration:"AddUserRoles"
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
            AutomaticMigrationsEnabled = false;
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
              new TodoItem { Id = Guid.NewGuid(), Completed = true, InSync = false, Task = "Wash the car" },
              new TodoItem { Id = Guid.NewGuid(), Completed = true, InSync = false, Task = "Walk the dog" }
            );
            

        }
    }
}
