namespace SpaStack.NET.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveGuidAnnontaion : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.TodoItems", "Id", c => c.Guid(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.TodoItems", "Id", c => c.Guid(nullable: false, identity: true));
        }
    }
}
