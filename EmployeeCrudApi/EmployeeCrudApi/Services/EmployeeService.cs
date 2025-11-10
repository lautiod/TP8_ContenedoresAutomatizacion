using EmployeeCrudApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EmployeeCrudApi.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IMongoCollection<Employee> _employeeCollection;

        public EmployeeService(IConfiguration configuration)
        {
            // Intentar obtener de ConnectionStrings primero, luego de MongoDB:ConnectionString
            var connectionString = configuration.GetConnectionString("MongoDB") 
                                   ?? configuration.GetSection("MongoDB:ConnectionString").Value;
            
            var mongoClient = new MongoClient(connectionString);
            var mongoDatabase = mongoClient.GetDatabase(configuration.GetSection("MongoDB:DatabaseName").Value);
            var collectionName = configuration.GetSection("MongoDB:CollectionName").Value;
            
            Console.WriteLine($"🔍 MongoDB ConnectionString: {(connectionString != null ? connectionString.Substring(0, Math.Min(30, connectionString.Length)) : "null")}...");
            Console.WriteLine($"🔍 MongoDB DatabaseName: {configuration.GetSection("MongoDB:DatabaseName").Value}");
            Console.WriteLine($"🔍 MongoDB CollectionName: {collectionName}");
            
            // Asegurarse de que la colección existe
            var collections = mongoDatabase.ListCollectionNames().ToList();
            if (!collections.Contains(collectionName))
            {
                mongoDatabase.CreateCollection(collectionName);
            }
            
            _employeeCollection = mongoDatabase.GetCollection<Employee>(collectionName);

            // Crear índices
            var indexKeys = Builders<Employee>.IndexKeys.Ascending(e => e.Name);
            var indexOptions = new CreateIndexOptions { Name = "NameIndex" };
            var indexModel = new CreateIndexModel<Employee>(indexKeys, indexOptions);
            _employeeCollection.Indexes.CreateOne(indexModel);
            
            // Índice para CreatedDate
            var dateIndexKeys = Builders<Employee>.IndexKeys.Descending(e => e.CreatedDate);
            var dateIndexOptions = new CreateIndexOptions { Name = "CreatedDateIndex" };
            var dateIndexModel = new CreateIndexModel<Employee>(dateIndexKeys, dateIndexOptions);
            _employeeCollection.Indexes.CreateOne(dateIndexModel);
        }

        public async Task<List<Employee>> GetAsync() =>
            await _employeeCollection.Find(_ => true).ToListAsync();

        public async Task<Employee> GetAsync(string id) =>
            await _employeeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Employee employee)
        {
            employee.CreatedDate = DateTime.UtcNow;
            await _employeeCollection.InsertOneAsync(employee);
        }

        public async Task UpdateAsync(string id, Employee employee)
        {
            await _employeeCollection.ReplaceOneAsync(x => x.Id == id, employee);
        }

        public async Task RemoveAsync(string id) =>
            await _employeeCollection.DeleteOneAsync(x => x.Id == id);
    }
}