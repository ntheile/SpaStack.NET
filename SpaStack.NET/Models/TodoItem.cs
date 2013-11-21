using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SpaStack.NET.Models
{
    public class TodoItem
    {
        [Key]
        public Guid Id { get; set; }

        public String Task { get; set; }
        public Boolean Completed { get; set; }
        public Boolean InSync { get; set; }    
    }


    // more advanced relationships

    public class Supplier
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
    }
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }

    public class Product
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public decimal Price { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        [ForeignKey("Supplier")]
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }

    }

  
}