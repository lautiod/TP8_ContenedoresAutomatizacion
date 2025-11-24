using FarmCrudApi.Models;
using System;
using Xunit;

namespace FarmCrudApi.Tests
{
    public class AnimalModelUnitTests
    {
        [Fact]
        public void Animal_CanSetAndGetId()
        {
            // Arrange
            var animal = new Animal();
            var expectedId = "507f1f77bcf86cd799439011";

            // Act
            animal.Id = expectedId;

            // Assert
            Assert.Equal(expectedId, animal.Id);
        }

        [Fact]
        public void Animal_CanSetAndGetName()
        {
            // Arrange
            var animal = new Animal();
            var expectedName = "John Doe";

            // Act
            animal.Name = expectedName;

            // Assert
            Assert.Equal(expectedName, animal.Name);
        }

        [Fact]
        public void Animal_CanSetAndGetCreatedDate()
        {
            // Arrange
            var animal = new Animal();
            var expectedDate = DateTime.UtcNow;

            // Act
            animal.CreatedDate = expectedDate;

            // Assert
            Assert.Equal(expectedDate, animal.CreatedDate);
        }

        [Fact]
        public void Animal_CanBeInitializedWithAllProperties()
        {
            // Arrange
            var id = "507f1f77bcf86cd799439012";
            var name = "Jane Smith";
            var createdDate = new DateTime(2025, 11, 11, 10, 30, 0, DateTimeKind.Utc);

            // Act
            var animal = new Animal
            {
                Id = id,
                Name = name,
                CreatedDate = createdDate
            };

            // Assert
            Assert.Equal(id, animal.Id);
            Assert.Equal(name, animal.Name);
            Assert.Equal(createdDate, animal.CreatedDate);
        }

        [Fact]
        public void Animal_IdIsNullByDefault()
        {
            // Arrange & Act
            var animal = new Animal();

            // Assert
            Assert.Null(animal.Id);
        }

        [Fact]
        public void Animal_NameIsNullByDefault()
        {
            // Arrange & Act
            var animal = new Animal();

            // Assert
            Assert.Null(animal.Name);
        }

        [Fact]
        public void Animal_CreatedDateIsDefaultByDefault()
        {
            // Arrange & Act
            var animal = new Animal();

            // Assert
            Assert.Equal(default(DateTime), animal.CreatedDate);
        }

        [Fact]
        public void Animal_CanBeCreatedWithObjectInitializer()
        {
            // Arrange & Act
            var animal = new Animal
            {
                Name = "Test Animal"
            };

            // Assert
            Assert.Equal("Test Animal", animal.Name);
            Assert.Null(animal.Id);
        }

        [Fact]
        public void Animal_PropertiesCanBeModified()
        {
            // Arrange
            var animal = new Animal
            {
                Id = "initial-id",
                Name = "Initial Name",
                CreatedDate = DateTime.UtcNow.AddDays(-1)
            };

            // Act
            animal.Id = "updated-id";
            animal.Name = "Updated Name";
            animal.CreatedDate = DateTime.UtcNow;

            // Assert
            Assert.Equal("updated-id", animal.Id);
            Assert.Equal("Updated Name", animal.Name);
            Assert.True(animal.CreatedDate > DateTime.UtcNow.AddMinutes(-1));
        }

        [Fact]
        public void Animal_SupportsEmptyStringName()
        {
            // Arrange
            var animal = new Animal();

            // Act
            animal.Name = string.Empty;

            // Assert
            Assert.Equal(string.Empty, animal.Name);
            Assert.NotNull(animal.Name);
        }

        [Fact]
        public void Animal_SupportsLongNames()
        {
            // Arrange
            var animal = new Animal();
            var longName = new string('A', 1000);

            // Act
            animal.Name = longName;

            // Assert
            Assert.Equal(longName, animal.Name);
            Assert.Equal(1000, animal.Name.Length);
        }

        [Fact]
        public void Animal_CreatedDateCanBeSetToMinValue()
        {
            // Arrange
            var animal = new Animal();

            // Act
            animal.CreatedDate = DateTime.MinValue;

            // Assert
            Assert.Equal(DateTime.MinValue, animal.CreatedDate);
        }

        [Fact]
        public void Animal_CreatedDateCanBeSetToMaxValue()
        {
            // Arrange
            var animal = new Animal();

            // Act
            animal.CreatedDate = DateTime.MaxValue;

            // Assert
            Assert.Equal(DateTime.MaxValue, animal.CreatedDate);
        }

        [Fact]
        public void Animal_IdCanBeSetToEmptyString()
        {
            // Arrange
            var animal = new Animal();

            // Act
            animal.Id = string.Empty;

            // Assert
            Assert.Equal(string.Empty, animal.Id);
        }

        [Fact]
        public void Animal_CanCreateMultipleInstancesIndependently()
        {
            // Arrange & Act
            var animal1 = new Animal { Id = "1", Name = "Animal 1" };
            var animal2 = new Animal { Id = "2", Name = "Animal 2" };

            // Assert
            Assert.NotEqual(animal1.Id, animal2.Id);
            Assert.NotEqual(animal1.Name, animal2.Name);
        }
    }
}
