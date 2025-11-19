using EmployeeCrudApi.Controllers;
using EmployeeCrudApi.Models;
using EmployeeCrudApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace EmployeeCrudApi.Tests
{
    public class EmployeeControllerTests
    {

        [Fact]
        public async Task GetAll_ReturnsListOfEmployees()
        {
            // Arrange
            var employees = new List<Employee>
            {
                new Employee { Id = "507f1f77bcf86cd799439011", Name = "John Doe" },
                new Employee { Id = "507f1f77bcf86cd799439012", Name = "Jane Doe" }
            };
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync()).ReturnsAsync(employees);

            var controller = new EmployeeController(mock.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John Doe", result[0].Name);
            Assert.Equal("Jane Doe", result[1].Name);
        }

        [Fact]
        public async Task GetById_ReturnsEmployeeById()
        {
            // Arrange
            var emp = new Employee { Id = "507f1f77bcf86cd799439011", Name = "John Doe" };
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync(emp.Id)).ReturnsAsync(emp);
            var controller = new EmployeeController(mock.Object);

            // Act
            var result = await controller.GetById(emp.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Value);
            Assert.Equal(emp.Id, result.Value.Id);
            Assert.Equal("John Doe", result.Value.Name);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenEmployeeMissing()
        {
            // Arrange
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Employee?)null);
            var controller = new EmployeeController(mock.Object);

            // Act
            var result = await controller.GetById("missing-id");

            // Assert
            Assert.Null(result.Value);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_AddsEmployee()
        {
            // Arrange
            var mock = new Mock<IEmployeeService>();
            var newEmployee = new Employee { Id = "507f1f77bcf86cd799439013", Name = "New Employee" };
            mock.Setup(s => s.CreateAsync(It.Is<Employee>(e => e.Name == "New Employee"))).Returns(Task.CompletedTask).Verifiable();

            var controller = new EmployeeController(mock.Object);
            var actionResult = await controller.Create(newEmployee);

            mock.Verify();
            var created = Assert.IsType<CreatedAtActionResult>(actionResult);
            Assert.Equal(nameof(EmployeeController.GetById), created.ActionName);
            Assert.Equal(newEmployee, created.Value);
        }

        [Fact]
        public async Task Update_UpdatesEmployee()
        {
            // Arrange
            var existing = new Employee { Id = "507f1f77bcf86cd799439014", Name = "Old Name" };
            var updated = new Employee { Id = existing.Id, Name = "Updated Name" };
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync(existing.Id)).ReturnsAsync(existing);
            mock.Setup(s => s.UpdateAsync(existing.Id, updated)).Returns(Task.CompletedTask).Verifiable();

            var controller = new EmployeeController(mock.Object);
            var result = await controller.Update(existing.Id, updated);

            mock.Verify();
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenEmployeeMissing()
        {
            // Arrange
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Employee?)null);
            var controller = new EmployeeController(mock.Object);

            var updated = new Employee { Id = "missing-id", Name = "Updated" };

            // Act
            var result = await controller.Update("missing-id", updated);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_RemovesEmployee()
        {
            // Arrange
            var employeeToDelete = new Employee { Id = "507f1f77bcf86cd799439015", Name = "John Doe" };
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync(employeeToDelete.Id)).ReturnsAsync(employeeToDelete);
            mock.Setup(s => s.RemoveAsync(employeeToDelete.Id)).Returns(Task.CompletedTask).Verifiable();

            var controller = new EmployeeController(mock.Object);
            var result = await controller.Delete(employeeToDelete.Id);

            mock.Verify();
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenEmployeeMissing()
        {
            // Arrange
            var mock = new Mock<IEmployeeService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Employee?)null);
            var controller = new EmployeeController(mock.Object);

            // Act
            var result = await controller.Delete("missing-id");

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
