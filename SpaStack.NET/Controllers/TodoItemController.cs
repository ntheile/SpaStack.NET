using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using SpaStack.NET.Models;

namespace SpaStack.NET.Controllers
{
    /*
    To add a route for this controller, merge these statements into the Register method of the WebApiConfig class. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using SpaStack.NET.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TodoItem>("TodoItem");
    config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
    */
    public class TodoItemController : ODataController
    {
        private MyDBContext db = new MyDBContext();

        // GET odata/TodoItem
        [Queryable]
        public IQueryable<TodoItem> GetTodoItem()
        {
            return db.TodoItems;
        }

        // GET odata/TodoItem(5)
        [Queryable]
        public SingleResult<TodoItem> GetTodoItem([FromODataUri] Guid key)
        {
            return SingleResult.Create(db.TodoItems.Where(todoitem => todoitem.Id == key));
        }

        // PUT odata/TodoItem(5)
        public IHttpActionResult Put([FromODataUri] Guid key, TodoItem todoitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != todoitem.Id)
            {
                return BadRequest();
            }

            db.Entry(todoitem).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(todoitem);
        }

        // POST odata/TodoItem
        public IHttpActionResult Post(TodoItem todoitem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //todoitem.InSync = true;

            db.TodoItems.Add(todoitem);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (TodoItemExists(todoitem.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(todoitem);
        }

        // PATCH odata/TodoItem(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] Guid key, Delta<TodoItem> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TodoItem todoitem = db.TodoItems.Find(key);
            if (todoitem == null)
            {
                return NotFound();
            }

            patch.Patch(todoitem);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(todoitem);
        }

        // DELETE odata/TodoItem(5)
        public IHttpActionResult Delete([FromODataUri] Guid key)
        {
            TodoItem todoitem = db.TodoItems.Find(key);
            if (todoitem == null)
            {
                return NotFound();
            }

            db.TodoItems.Remove(todoitem);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TodoItemExists(Guid key)
        {
            return db.TodoItems.Count(e => e.Id == key) > 0;
        }
    }
}
