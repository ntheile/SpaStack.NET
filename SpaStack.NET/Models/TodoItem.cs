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
        //[Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public String Task { get; set; }
        public Boolean Completed { get; set; }
        public Boolean InSync { get; set; }    
    }
}