using EmployeeCrudApi.Models;
using EmployeeCrudApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace EmployeeCrudApi.Controllers
{
    // Base route: api/Employee
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyPolicy")] // Apply CORS policy explicitly to this controller
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET api/Employee/getall or api/Employee/GetAll
    [HttpGet("getall")]
        public async Task<List<Employee>> GetAll()
        {
            return await _employeeService.GetAsync();
        }

        // GET api/Employee/getbyid?id=... or api/Employee/GetById?id=...
    [HttpGet("getbyid")]
        public async Task<ActionResult<Employee>> GetById(string id)
        {
            var employee = await _employeeService.GetAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            return employee;
        }

        // POST api/Employee/create or api/Employee/Create
    [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            await _employeeService.CreateAsync(employee);
            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
        }

        // PUT api/Employee/update or api/Employee/Update
    [HttpPut("update")]
        public async Task<IActionResult> Update(string id, [FromBody] Employee employee)
        {
            var existingEmployee = await _employeeService.GetAsync(id);
            if (existingEmployee == null)
            {
                return NotFound();
            }
            employee.Id = id;
            await _employeeService.UpdateAsync(id, employee);
            return NoContent();
        }

        // DELETE api/Employee/delete?id=... or api/Employee/Delete?id=...
    [HttpDelete("delete")]
        public async Task<IActionResult> Delete(string id)
        {
            var employee = await _employeeService.GetAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            await _employeeService.RemoveAsync(id);
            return NoContent();
        }
    }
}
