using FarmCrudApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FarmCrudApi.Services
{
    public class AnimalService : IAnimalService
    {
            private readonly IMongoCollection<Animal> _animalCollection;

    public AnimalService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var mongoDatabase = mongoClient.GetDatabase(configuration.GetSection("MongoDB:DatabaseName").Value);
            var collectionName = configuration.GetSection("MongoDB:CollectionName").Value;
            
            Console.WriteLine($"🔍 MongoDB DatabaseName: {configuration.GetSection("MongoDB:DatabaseName").Value}");
            Console.WriteLine($"🔍 MongoDB CollectionName: {collectionName}");
            
            // Asegurarse de que la colección existe
            var collections = mongoDatabase.ListCollectionNames().ToList();
            if (!collections.Contains(collectionName))
            {
                mongoDatabase.CreateCollection(collectionName);
            }
            
                _animalCollection = mongoDatabase.GetCollection<Animal>(collectionName);

            // Crear índices
                var indexKeys = Builders<Animal>.IndexKeys.Ascending(e => e.Name);
            var indexOptions = new CreateIndexOptions { Name = "NameIndex" };
            var indexModel = new CreateIndexModel<Animal>(indexKeys, indexOptions);
                _animalCollection.Indexes.CreateOne(indexModel);
            
            // Índice para CreatedDate
                var dateIndexKeys = Builders<Animal>.IndexKeys.Descending(e => e.CreatedDate);
            var dateIndexOptions = new CreateIndexOptions { Name = "CreatedDateIndex" };
            var dateIndexModel = new CreateIndexModel<Animal>(dateIndexKeys, dateIndexOptions);
                _animalCollection.Indexes.CreateOne(dateIndexModel);
        }

            public async Task<List<Animal>> GetAsync() =>
                await _animalCollection.Find(_ => true).ToListAsync();

            public async Task<Animal> GetAsync(string id) =>
                await _animalCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

            public async Task CreateAsync(Animal animal)
        {
                animal.CreatedDate = DateTime.UtcNow;
                await _animalCollection.InsertOneAsync(animal);
        }

            public async Task UpdateAsync(string id, Animal animal)
        {
                await _animalCollection.ReplaceOneAsync(x => x.Id == id, animal);
        }

            public async Task RemoveAsync(string id) =>
                await _animalCollection.DeleteOneAsync(x => x.Id == id);
    }
}