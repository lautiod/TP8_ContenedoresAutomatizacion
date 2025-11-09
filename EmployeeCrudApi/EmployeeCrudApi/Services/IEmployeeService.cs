using EmployeeCrudApi.Models;

namespace EmployeeCrudApi.Services
{
    public interface IEmployeeService
    {
        Task<List<Employee>> GetAsync();
        Task<Employee> GetAsync(string id);
        Task CreateAsync(Employee employee);
        Task UpdateAsync(string id, Employee employee);
        Task RemoveAsync(string id);
    }
}
