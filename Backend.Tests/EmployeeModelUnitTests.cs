using EmployeeCrudApi.Models;
using System;
using Xunit;

namespace EmployeeCrudApi.Tests
{
    public class EmployeeModelUnitTests
    {
        [Fact]
        public void Employee_CanSetAndGetId()
        {
            // Arrange
            var employee = new Employee();
            var expectedId = "507f1f77bcf86cd799439011";

            // Act
            employee.Id = expectedId;

            // Assert
            Assert.Equal(expectedId, employee.Id);
        }

        [Fact]
        public void Employee_CanSetAndGetName()
        {
            // Arrange
            var employee = new Employee();
            var expectedName = "John Doe";

            // Act
            employee.Name = expectedName;

            // Assert
            Assert.Equal(expectedName, employee.Name);
        }

        [Fact]
        public void Employee_CanSetAndGetCreatedDate()
        {
            // Arrange
            var employee = new Employee();
            var expectedDate = DateTime.UtcNow;

            // Act
            employee.CreatedDate = expectedDate;

            // Assert
            Assert.Equal(expectedDate, employee.CreatedDate);
        }

        [Fact]
        public void Employee_CanBeInitializedWithAllProperties()
        {
            // Arrange
            var id = "507f1f77bcf86cd799439012";
            var name = "Jane Smith";
            var createdDate = new DateTime(2025, 11, 11, 10, 30, 0, DateTimeKind.Utc);

            // Act
            var employee = new Employee
            {
                Id = id,
                Name = name,
                CreatedDate = createdDate
            };

            // Assert
            Assert.Equal(id, employee.Id);
            Assert.Equal(name, employee.Name);
            Assert.Equal(createdDate, employee.CreatedDate);
        }

        [Fact]
        public void Employee_IdIsNullByDefault()
        {
            // Arrange & Act
            var employee = new Employee();

            // Assert
            Assert.Null(employee.Id);
        }

        [Fact]
        public void Employee_NameIsNullByDefault()
        {
            // Arrange & Act
            var employee = new Employee();

            // Assert
            Assert.Null(employee.Name);
        }

        [Fact]
        public void Employee_CreatedDateIsDefaultByDefault()
        {
            // Arrange & Act
            var employee = new Employee();

            // Assert
            Assert.Equal(default(DateTime), employee.CreatedDate);
        }

        [Fact]
        public void Employee_CanBeCreatedWithObjectInitializer()
        {
            // Arrange & Act
            var employee = new Employee
            {
                Name = "Test Employee"
            };

            // Assert
            Assert.Equal("Test Employee", employee.Name);
            Assert.Null(employee.Id);
        }

        [Fact]
        public void Employee_PropertiesCanBeModified()
        {
            // Arrange
            var employee = new Employee
            {
                Id = "initial-id",
                Name = "Initial Name",
                CreatedDate = DateTime.UtcNow.AddDays(-1)
            };

            // Act
            employee.Id = "updated-id";
            employee.Name = "Updated Name";
            employee.CreatedDate = DateTime.UtcNow;

            // Assert
            Assert.Equal("updated-id", employee.Id);
            Assert.Equal("Updated Name", employee.Name);
            Assert.True(employee.CreatedDate > DateTime.UtcNow.AddMinutes(-1));
        }

        [Fact]
        public void Employee_SupportsEmptyStringName()
        {
            // Arrange
            var employee = new Employee();

            // Act
            employee.Name = string.Empty;

            // Assert
            Assert.Equal(string.Empty, employee.Name);
            Assert.NotNull(employee.Name);
        }

        [Fact]
        public void Employee_SupportsLongNames()
        {
            // Arrange
            var employee = new Employee();
            var longName = new string('A', 1000);

            // Act
            employee.Name = longName;

            // Assert
            Assert.Equal(longName, employee.Name);
            Assert.Equal(1000, employee.Name.Length);
        }

        [Fact]
        public void Employee_CreatedDateCanBeSetToMinValue()
        {
            // Arrange
            var employee = new Employee();

            // Act
            employee.CreatedDate = DateTime.MinValue;

            // Assert
            Assert.Equal(DateTime.MinValue, employee.CreatedDate);
        }

        [Fact]
        public void Employee_CreatedDateCanBeSetToMaxValue()
        {
            // Arrange
            var employee = new Employee();

            // Act
            employee.CreatedDate = DateTime.MaxValue;

            // Assert
            Assert.Equal(DateTime.MaxValue, employee.CreatedDate);
        }

        [Fact]
        public void Employee_IdCanBeSetToEmptyString()
        {
            // Arrange
            var employee = new Employee();

            // Act
            employee.Id = string.Empty;

            // Assert
            Assert.Equal(string.Empty, employee.Id);
        }

        [Fact]
        public void Employee_CanCreateMultipleInstancesIndependently()
        {
            // Arrange & Act
            var employee1 = new Employee { Id = "1", Name = "Employee 1" };
            var employee2 = new Employee { Id = "2", Name = "Employee 2" };

            // Assert
            Assert.NotEqual(employee1.Id, employee2.Id);
            Assert.NotEqual(employee1.Name, employee2.Name);
        }
    }
}
