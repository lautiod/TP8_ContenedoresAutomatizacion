using FarmCrudApi.Models;
using FarmCrudApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace FarmCrudApi.Controllers
{
    // Base route: api/Animal
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyPolicy")] // Apply CORS policy explicitly to this controller
    public class AnimalController : ControllerBase
    {
        private readonly IAnimalService _animalService;

        public AnimalController(IAnimalService animalService)
        {
            _animalService = animalService;
        }

        // GET api/Animal/getall or api/Animal/GetAll
    [HttpGet("getall")]
        public async Task<List<Animal>> GetAll()
        {
            return await _animalService.GetAsync();
        }

        // GET api/Animal/getbyid?id=... or api/Animal/GetById?id=...
    [HttpGet("getbyid")]
        public async Task<ActionResult<Animal>> GetById(string id)
        {
            var animal = await _animalService.GetAsync(id);
            if (animal == null)
            {
                return NotFound();
            }
            return animal;
        }

        // POST api/Animal/create or api/Animal/Create
    [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Animal animal)
        {
            await _animalService.CreateAsync(animal);
            return CreatedAtAction(nameof(GetById), new { id = animal.Id }, animal);
        }

        // PUT api/Animal/update or api/Animal/Update
    [HttpPut("update")]
        public async Task<IActionResult> Update(string id, [FromBody] Animal animal)
        {
            var existingAnimal = await _animalService.GetAsync(id);
            if (existingAnimal == null)
            {
                return NotFound();
            }
            animal.Id = id;
            await _animalService.UpdateAsync(id, animal);
            return NoContent();
        }

        // DELETE api/Animal/delete?id=... or api/Animal/Delete?id=...
    [HttpDelete("delete")]
        public async Task<IActionResult> Delete(string id)
        {
            var animal = await _animalService.GetAsync(id);
            if (animal == null)
            {
                return NotFound();
            }
            await _animalService.RemoveAsync(id);
            return NoContent();
        }
    }
}
