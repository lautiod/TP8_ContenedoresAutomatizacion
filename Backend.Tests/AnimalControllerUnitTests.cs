using FarmCrudApi.Controllers;
using FarmCrudApi.Models;
using FarmCrudApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace FarmCrudApi.Tests
{
    public class AnimalControllerTests
    {

        [Fact]
    public async Task GetAll_ReturnsListOfAnimals()
        {
            // Arrange
            var animals = new List<Animal>
            {
                new Animal { Id = "507f1f77bcf86cd799439011", Name = "John Doe" },
                new Animal { Id = "507f1f77bcf86cd799439012", Name = "Jane Doe" }
            };
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync()).ReturnsAsync(animals);

            var controller = new AnimalController(mock.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John Doe", result[0].Name);
            Assert.Equal("Jane Doe", result[1].Name);
        }

        [Fact]
    public async Task GetById_ReturnsAnimalById()
        {
            // Arrange
            var emp = new Animal { Id = "507f1f77bcf86cd799439011", Name = "John Doe" };
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync(emp.Id)).ReturnsAsync(emp);
            var controller = new AnimalController(mock.Object);

            // Act
            var result = await controller.GetById(emp.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Value);
            Assert.Equal(emp.Id, result.Value.Id);
            Assert.Equal("John Doe", result.Value.Name);
        }

        [Fact]
    public async Task GetById_ReturnsNotFound_WhenAnimalMissing()
        {
            // Arrange
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Animal?)null);
            var controller = new AnimalController(mock.Object);

            // Act
            var result = await controller.GetById("missing-id");

            // Assert
            Assert.Null(result.Value);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
    public async Task Create_AddsAnimal()
        {
            // Arrange
            var mock = new Mock<IAnimalService>();
            var newAnimal = new Animal { Id = "507f1f77bcf86cd799439013", Name = "New Animal" };
            mock.Setup(s => s.CreateAsync(It.Is<Animal>(e => e.Name == "New Animal"))).Returns(Task.CompletedTask).Verifiable();

            var controller = new AnimalController(mock.Object);
            var actionResult = await controller.Create(newAnimal);

            mock.Verify();
            var created = Assert.IsType<CreatedAtActionResult>(actionResult);
            Assert.Equal(nameof(AnimalController.GetById), created.ActionName);
            Assert.Equal(newAnimal, created.Value);
        }

        [Fact]
    public async Task Update_UpdatesAnimal()
        {
            // Arrange
            var existing = new Animal { Id = "507f1f77bcf86cd799439014", Name = "Old Name" };
            var updated = new Animal { Id = existing.Id, Name = "Updated Name" };
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync(existing.Id)).ReturnsAsync(existing);
            mock.Setup(s => s.UpdateAsync(existing.Id, updated)).Returns(Task.CompletedTask).Verifiable();

            var controller = new AnimalController(mock.Object);
            var result = await controller.Update(existing.Id, updated);

            mock.Verify();
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
    public async Task Update_ReturnsNotFound_WhenAnimalMissing()
        {
            // Arrange
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Animal?)null);
            var controller = new AnimalController(mock.Object);

            var updated = new Animal { Id = "missing-id", Name = "Updated" };

            // Act
            var result = await controller.Update("missing-id", updated);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
    public async Task Delete_RemovesAnimal()
        {
            // Arrange
            var animalToDelete = new Animal { Id = "507f1f77bcf86cd799439015", Name = "John Doe" };
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync(animalToDelete.Id)).ReturnsAsync(animalToDelete);
            mock.Setup(s => s.RemoveAsync(animalToDelete.Id)).Returns(Task.CompletedTask).Verifiable();

            var controller = new AnimalController(mock.Object);
            var result = await controller.Delete(animalToDelete.Id);

            mock.Verify();
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
    public async Task Delete_ReturnsNotFound_WhenAnimalMissing()
        {
            // Arrange
            var mock = new Mock<IAnimalService>();
            mock.Setup(s => s.GetAsync("missing-id")).ReturnsAsync((Animal?)null);
            var controller = new AnimalController(mock.Object);

            // Act
            var result = await controller.Delete("missing-id");

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
