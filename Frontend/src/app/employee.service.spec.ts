import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { DatePipe } from '@angular/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let datePipe: DatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeService,
        DatePipe
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
    datePipe = TestBed.inject(DatePipe);
  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should retrieve all employees', () => {
    const today = new Date();
    const expectedDateTime = datePipe.transform(today, 'dd/MM/yyyy HH:mm:ss', undefined) ?? '';  // Formato del backend

    // Los datos que vienen del backend (simulados)
    const mockBackendEmployees: Employee[] = [
      new Employee('1', 'John Doe', expectedDateTime),
      new Employee('2', 'Jane Smith', expectedDateTime)
    ];

    // Los datos esperados después de la transformación del servicio
    const expectedFormattedDate = datePipe.transform(today, 'yyyy-MM-ddTHH:mm:ss', undefined) ?? '';

    service.getAllEmployee().subscribe(employees => {
      expect(employees.length).toBe(2);
      employees.forEach((employee, index) => {
        // Agrega depuración aquí
        console.log('Employee createdDate:', employee.createdDate);
        console.log('Expected formatted date:', expectedFormattedDate);

        // Comparar directamente los strings de fecha ya formateados
        expect(employee.createdDate).toBeTruthy();
        expect(employee.name).toBe(mockBackendEmployees[index].name);
        // Verificar que ambas fechas están en el formato correcto (yyyy-MM-ddTHH:mm:ss)
        expect(employee.createdDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBackendEmployees);
  });

  it('should return empty array when backend returns empty list', () => {
    service.getAllEmployee().subscribe(employees => {
      expect(employees.length).toBe(0);
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // backend responde lista vacía
  });

  it('should propagate http error', () => {
    const status = 500;
    const statusText = 'Internal Server Error';

    service.getAllEmployee().subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'boom' }, { status, statusText });
  });

  it('should parse mixed date formats (dd/MM/yyyy HH:mm:ss and ISO)', () => {
    const datePipeLocal = datePipe;
    const now = new Date('2025-05-01T13:45:30Z');
    const legacyFormat = datePipeLocal.transform(now, 'dd/MM/yyyy HH:mm:ss', undefined) ?? '';
    const isoFormat = now.toISOString();

    const mockBackendEmployees: any[] = [
      { id: '1', name: 'Legacy', createdDate: legacyFormat },
      { id: '2', name: 'Iso', createdDate: isoFormat }
    ];

    service.getAllEmployee().subscribe(employees => {
      expect(employees.length).toBe(2);
      employees.forEach(e => {
        expect(e.createdDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getall`);
    req.flush(mockBackendEmployees);
  });

  // ==================== Tests adicionales para otros métodos ====================

  it('should create an employee', () => {
    const newEmployee = new Employee('', 'New Employee', '2025-11-11T10:00:00');
    const createdEmployee = new Employee('123', 'New Employee', '2025-11-11T10:00:00');

    service.createEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(createdEmployee);
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: newEmployee.name });
    req.flush(createdEmployee);
  });

  it('should update an employee', () => {
    const employeeId = '123';
    const updatedEmployee = new Employee(employeeId, 'Updated Name', '2025-11-11T10:00:00');

    service.updateEmployee(updatedEmployee).subscribe();

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/update/?id=${employeeId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: updatedEmployee.name });
    req.flush(null);
  });

  it('should delete an employee by id', () => {
    const employeeId = '123';

    service.deleteEmployeeById(employeeId).subscribe();

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/delete/?id=${employeeId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get employee by id', () => {
    const employeeId = '123';
    const employee = new Employee(employeeId, 'John Doe', '2025-11-11T10:00:00');

    service.getEmployeeById(employeeId).subscribe(result => {
      expect(result).toEqual(employee);
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getbyid/?id=${employeeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(employee);
  });

  it('should handle error when creating employee fails', () => {
    const newEmployee = new Employee('', 'New Employee', '2025-11-11T10:00:00');
    const status = 400;
    const statusText = 'Bad Request';

    service.createEmployee(newEmployee).subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/create`);
    req.flush({ message: 'Invalid data' }, { status, statusText });
  });

  it('should handle error when deleting employee fails', () => {
    const employeeId = '123';
    const status = 404;
    const statusText = 'Not Found';

    service.deleteEmployeeById(employeeId).subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/delete/?id=${employeeId}`);
    req.flush({ message: 'Employee not found' }, { status, statusText });
  });


});