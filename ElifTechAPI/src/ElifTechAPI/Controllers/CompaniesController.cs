using System.Collections.Generic;
using System.Linq;
using ElifTechAPI.Model;
using Microsoft.AspNetCore.Mvc;

namespace ElifTechAPI.Controllers
{
    [Route("[controller]")]
    public class CompaniesController : Controller
    {
        //GET companies
        [HttpGet(Name = "GetAll")]
        public IEnumerable<Company> GetAll()
        {
            var con = new DbConnector();
            return con.GetAll().AsEnumerable();
        }

        //POST companies
        [HttpPost(Name = "Add")]
        public IActionResult Add([FromBody] Company item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            var con = new DbConnector();
            var id = con.Add(item);

            return CreatedAtRoute("Add", id);
        }

        // PUT companies
        [HttpPut(Name = "Edit")]
        public IActionResult Edit([FromBody] Company item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            var con = new DbConnector();
            if (!con.Edit(item))
            {
                return NotFound();
            }
            return new OkResult();
        }

        // DELETE companies/{id}
        [HttpDelete("{id}", Name = "Delete")]
        public IActionResult Delete(int id)
        {
            var con = new DbConnector();
            if (!con.DeleteById(id))
            {
                return NotFound();
            }
            return new OkResult();
        }

        // DELETE companies/deleteall
        [HttpDelete("deleteAll",Name = "DeleteAll")]
        public IActionResult DeleteAll()
        {
            var con = new DbConnector();
            if (!con.DeleteAll())
            {
                return NotFound();
            }
            return new OkResult();
        }
    }
}
