namespace SpaStack.NET.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FirstComment : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TodoItems",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Task = c.String(),
                        Completed = c.Boolean(nullable: false),
                        InSync = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.TodoItems");
        }
    }
}
