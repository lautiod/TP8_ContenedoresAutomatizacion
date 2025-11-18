using EmployeeCrudApi.Models;
using EmployeeCrudApi.Services;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Moq;
using Xunit;

namespace EmployeeCrudApi.Tests
{
    public class EmployeeServiceUnitTests
    {
        private readonly Mock<IMongoClient> _mockMongoClient;
        private readonly Mock<IMongoDatabase> _mockDatabase;
        private readonly Mock<IMongoCollection<Employee>> _mockCollection;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IAsyncCursor<Employee>> _mockCursor;
        private readonly Mock<IMongoIndexManager<Employee>> _mockIndexManager;

        public EmployeeServiceUnitTests()
        {
            _mockMongoClient = new Mock<IMongoClient>();
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockCollection = new Mock<IMongoCollection<Employee>>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockCursor = new Mock<IAsyncCursor<Employee>>();
            _mockIndexManager = new Mock<IMongoIndexManager<Employee>>();

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
            
            _mockDatabase.Setup(d => d.GetCollection<Employee>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                        .Returns(_mockCollection.Object);

            // Setup index manager
            _mockCollection.Setup(c => c.Indexes).Returns(_mockIndexManager.Object);
            _mockIndexManager.Setup(i => i.CreateOne(It.IsAny<CreateIndexModel<Employee>>(), It.IsAny<CreateOneIndexOptions>(), It.IsAny<CancellationToken>()))
                            .Returns("indexName");
        }

        [Fact]
        public async Task GetAsync_ReturnsAllEmployees()
        {
            // Arrange
            var employees = new List<Employee>
            {
                new Employee { Id = "1", Name = "John Doe", CreatedDate = DateTime.UtcNow },
                new Employee { Id = "2", Name = "Jane Smith", CreatedDate = DateTime.UtcNow }
            };

            _mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                      .Returns(true)
                      .Returns(false);
            _mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                      .ReturnsAsync(true)
                      .ReturnsAsync(false);
            _mockCursor.Setup(c => c.Current).Returns(employees);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<FindOptions<Employee, Employee>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("John Doe", result[0].Name);
            Assert.Equal("Jane Smith", result[1].Name);
        }

        [Fact]
        public async Task GetAsync_ReturnsEmptyList_WhenNoEmployees()
        {
            // Arrange
            var emptyList = new List<Employee>();

            _mockCursor.Setup(c => c.MoveNext(It.IsAny<CancellationToken>())).Returns(false);
            _mockCursor.Setup(c => c.Current).Returns(emptyList);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<FindOptions<Employee, Employee>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAsync_WithId_ReturnsEmployee()
        {
            // Arrange
            var employee = new Employee { Id = "123", Name = "Test Employee", CreatedDate = DateTime.UtcNow };

            _mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                      .Returns(true)
                      .Returns(false);
            _mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                      .ReturnsAsync(true)
                      .ReturnsAsync(false);
            _mockCursor.Setup(c => c.Current).Returns(new List<Employee> { employee });

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<FindOptions<Employee, Employee>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync("123");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("123", result.Id);
            Assert.Equal("Test Employee", result.Name);
        }

        [Fact]
        public async Task GetAsync_WithInvalidId_ReturnsNull()
        {
            // Arrange
            _mockCursor.Setup(c => c.MoveNext(It.IsAny<CancellationToken>())).Returns(false);
            _mockCursor.Setup(c => c.Current).Returns(new List<Employee>());

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<FindOptions<Employee, Employee>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(_mockCursor.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            var result = await service.GetAsync("nonexistent");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_SetsCreatedDateAndInsertsEmployee()
        {
            // Arrange
            var employee = new Employee { Name = "New Employee" };
            var beforeCreate = DateTime.UtcNow;

            _mockCollection.Setup(c => c.InsertOneAsync(
                It.IsAny<Employee>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.CreateAsync(employee);
            var afterCreate = DateTime.UtcNow;

            // Assert
            Assert.NotEqual(default(DateTime), employee.CreatedDate);
            Assert.True(employee.CreatedDate >= beforeCreate && employee.CreatedDate <= afterCreate);
            
            _mockCollection.Verify(c => c.InsertOneAsync(
                It.Is<Employee>(e => e.Name == "New Employee" && e.CreatedDate != default(DateTime)),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ReplacesEmployee()
        {
            // Arrange
            var employeeId = "123";
            var updatedEmployee = new Employee { Id = employeeId, Name = "Updated Name", CreatedDate = DateTime.UtcNow };

            var mockReplaceResult = new Mock<ReplaceOneResult>();
            mockReplaceResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockReplaceResult.Setup(r => r.ModifiedCount).Returns(1);

            _mockCollection.Setup(c => c.ReplaceOneAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<Employee>(),
                It.IsAny<ReplaceOptions>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockReplaceResult.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.UpdateAsync(employeeId, updatedEmployee);

            // Assert
            _mockCollection.Verify(c => c.ReplaceOneAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.Is<Employee>(e => e.Name == "Updated Name"),
                It.IsAny<ReplaceOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task RemoveAsync_DeletesEmployee()
        {
            // Arrange
            var employeeId = "123";

            var mockDeleteResult = new Mock<DeleteResult>();
            mockDeleteResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockDeleteResult.Setup(r => r.DeletedCount).Returns(1);

            _mockCollection.Setup(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockDeleteResult.Object);

            var service = new EmployeeService(_mockMongoClient.Object, _mockConfiguration.Object);

            // Act
            await service.RemoveAsync(employeeId);

            // Assert
            _mockCollection.Verify(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<Employee>>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
