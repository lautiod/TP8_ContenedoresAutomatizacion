using FarmCrudApi.Models;
using FarmCrudApi.Services;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Moq;
using Xunit;

namespace FarmCrudApi.Tests
{
    public class AnimalServiceUnitTests
    {
        private readonly Mock<IMongoClient> _mockMongoClient;
        private readonly Mock<IMongoDatabase> _mockDatabase;
    private readonly Mock<IMongoCollection<Animal>> _mockCollection;
        private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<IAsyncCursor<Animal>> _mockCursor;
    private readonly Mock<IMongoIndexManager<Animal>> _mockIndexManager;

    public AnimalServiceUnitTests()
        {
            _mockMongoClient = new Mock<IMongoClient>();
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockCollection = new Mock<IMongoCollection<Animal>>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockCursor = new Mock<IAsyncCursor<Animal>>();
            _mockIndexManager = new Mock<IMongoIndexManager<Animal>>();

            // Setup configuration
            var mockDbNameSection = new Mock<IConfigurationSection>();
            mockDbNameSection.Setup(s => s.Value).Returns("testdb");
            
            var mockCollectionNameSection = new Mock<IConfigurationSection>();
            mockCollectionNameSection.Setup(s => s.Value).Returns("testcollection");

            _mockConfiguration.Setup(c => c.GetSection("MongoDB:DatabaseName")).Returns(mockDbNameSection.Object);
            _mockConfiguration.Setup(c => c.GetSection("MongoDB:CollectionName")).Returns(mockCollectionNameSection.Object);

            // Setup MongoDB mocks
            _mockMongoClient.Setup(c => c.GetDatabase(It.IsAny<string>(), It.IsAny<MongoDatabaseSettings>()))
                           .Returns(_mockDatabase.Object);

            // Mock ListCollectionNames to return empty list (collection doesn't exist)
            var emptyListCursor = new Mock<IAsyncCursor<string>>();
            emptyListCursor.Setup(c => c.MoveNext(It.IsAny<CancellationToken>())).Returns(false);
            emptyListCursor.Setup(c => c.Current).Returns(new List<string>());
            
            _mockDatabase.Setup(d => d.ListCollectionNames(It.IsAny<ListCollectionNamesOptions>(), It.IsAny<CancellationToken>()))
                        .Returns(emptyListCursor.Object);

            _mockDatabase.Setup(d => d.CreateCollection(It.IsAny<string>(), It.IsAny<CreateCollectionOptions>(), It.IsAny<CancellationToken>()));
            
            _mockDatabase.Setup(d => d.GetCollection<Animal>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                        .Returns(_mockCollection.Object);

            // Setup index manager
            _mockCollection.Setup(c => c.Indexes).Returns(_mockIndexManager.Object);
            _mockIndexManager.Setup(i => i.CreateOne(It.IsAny<CreateIndexModel<Animal>>(), It.IsAny<CreateOneIndexOptions>(), It.IsAny<CancellationToken>()))
                            .Returns("indexName");
        }

        [Fact]
        public async Task GetAsync_ReturnsAllAnimals()
        {
            // Arrange
            var animals = new List<Animal>
            {
                new Animal { Id = "1", Name = "John Doe", CreatedDate = DateTime.UtcNow },
                new Animal { Id = "2", Name = "Jane Smith", CreatedDate = DateTime.UtcNow }
            };

            _mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                      .Returns(true)
                      .Returns(false);
            _mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                      .ReturnsAsync(true)
                      .ReturnsAsync(false);
            _mockCursor.Setup(c => c.Current).Returns(animals);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<FindOptions<Animal, Animal>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            // Assert.Equal("John Doe", result[0].Name);
            // Cambio de nombre para probar que los tests fallan si los datos son incorrectos
            Assert.Equal("Nombre Equivocado", result[0].Name);
            Assert.Equal("Jane Smith", result[1].Name);
        }

        [Fact]
        public async Task GetAsync_ReturnsEmptyList_WhenNoAnimals()
        {
            // Arrange
            var emptyList = new List<Animal>();

            _mockCursor.Setup(c => c.MoveNext(It.IsAny<CancellationToken>())).Returns(false);
            _mockCursor.Setup(c => c.Current).Returns(emptyList);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<FindOptions<Animal, Animal>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAsync_WithId_ReturnsAnimal()
        {
            // Arrange
            var animal = new Animal { Id = "123", Name = "Test Animal", CreatedDate = DateTime.UtcNow };

            _mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                      .Returns(true)
                      .Returns(false);
            _mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                      .ReturnsAsync(true)
                      .ReturnsAsync(false);
            _mockCursor.Setup(c => c.Current).Returns(new List<Animal> { animal });

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<FindOptions<Animal, Animal>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync("123");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("123", result.Id);
            Assert.Equal("Test Animal", result.Name);
        }

        [Fact]
        public async Task GetAsync_WithInvalidId_ReturnsNull()
        {
            // Arrange
            _mockCursor.Setup(c => c.MoveNext(It.IsAny<CancellationToken>())).Returns(false);
            _mockCursor.Setup(c => c.Current).Returns(new List<Animal>());


            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<FindOptions<Animal, Animal>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync("nonexistent");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_SetsCreatedDateAndInsertsAnimal()
        {
            // Arrange
            var animal = new Animal { Name = "New Animal" };
            var beforeCreate = DateTime.UtcNow;

            _mockCollection.Setup(c => c.InsertOneAsync(
                It.IsAny<Animal>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.CreateAsync(animal);
            var afterCreate = DateTime.UtcNow;

            // Assert
            Assert.NotEqual(default(DateTime), animal.CreatedDate);
            Assert.True(animal.CreatedDate >= beforeCreate && animal.CreatedDate <= afterCreate);
            
            _mockCollection.Verify(c => c.InsertOneAsync(
                It.Is<Animal>(e => e.Name == "New Animal" && e.CreatedDate != default(DateTime)),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ReplacesAnimal()
        {
            // Arrange
            var animalId = "123";
            var updatedAnimal = new Animal { Id = animalId, Name = "Updated Name", CreatedDate = DateTime.UtcNow };

            var mockReplaceResult = new Mock<ReplaceOneResult>();
            mockReplaceResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockReplaceResult.Setup(r => r.ModifiedCount).Returns(1);


            _mockCollection.Setup(c => c.ReplaceOneAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<Animal>(),
                It.IsAny<ReplaceOptions>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockReplaceResult.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.UpdateAsync(animalId, updatedAnimal);

            // Assert
            _mockCollection.Verify(c => c.ReplaceOneAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.Is<Animal>(e => e.Name == "Updated Name"),
                It.IsAny<ReplaceOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task RemoveAsync_DeletesAnimal()
        {
            // Arrange
            var animalId = "123";

            var mockDeleteResult = new Mock<DeleteResult>();
            mockDeleteResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockDeleteResult.Setup(r => r.DeletedCount).Returns(1);


            _mockCollection.Setup(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockDeleteResult.Object);

            var service = new AnimalService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.RemoveAsync(animalId);

            // Assert
            _mockCollection.Verify(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<Animal>>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
