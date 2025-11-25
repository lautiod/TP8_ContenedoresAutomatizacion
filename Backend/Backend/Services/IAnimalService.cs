using FarmCrudApi.Models;

namespace FarmCrudApi.Services
{
    public interface IAnimalService
    {
        Task<List<Animal>> GetAsync();
        Task<Animal> GetAsync(string id);
        Task CreateAsync(Animal animal);
        Task UpdateAsync(string id, Animal animal);
        Task RemoveAsync(string id);
    }
}