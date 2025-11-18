import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmployeeComponent } from './employee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Employee } from '../employee.model';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getAllEmployee',
      'deleteEmployeeById'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [EmployeeComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock por defecto
    employeeService.getAllEmployee.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'John Doe', '2025-11-11T10:00:00'),
      new Employee('2', 'Jane Smith', '2025-11-11T11:00:00')
    ];

    employeeService.getAllEmployee.and.returnValue(of(mockEmployees));

    component.ngOnInit();

    component.employees.subscribe(employees => {
      expect(employees.length).toBe(2);
      expect(employees[0].name).toBe('Jane Smith'); // Ordenado por nombre desc por defecto
    });
  });

  it('should navigate to add employee page when addEmployee is called', () => {
    component.addEmployee();
    expect(router.navigate).toHaveBeenCalledWith(['/addemployee']);
  });

  it('should navigate to edit employee page with id', () => {
    const employeeId = '123';
    component.editEmployee(employeeId);
    expect(router.navigate).toHaveBeenCalledWith(['/addemployee'], { queryParams: { id: employeeId } });
  });

  it('should delete employee and reload list', (done) => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    employeeService.deleteEmployeeById.and.returnValue(of({}));
    employeeService.getAllEmployee.and.returnValue(of(mockEmployees));

    component.deleteEmployee('1');

    expect(employeeService.deleteEmployeeById).toHaveBeenCalledWith('1');
    expect(component.imgLoadingDisplay).toBe('inline');

    setTimeout(() => {
      expect(employeeService.getAllEmployee).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should filter employees by search term', () => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'John Doe', '2025-11-11T10:00:00'),
      new Employee('2', 'Jane Smith', '2025-11-11T11:00:00'),
      new Employee('3', 'Bob Johnson', '2025-11-11T12:00:00')
    ];

    employeeService.getAllEmployee.and.returnValue(of(mockEmployees));

    component.searchItem('john');

    component.employees.subscribe(employees => {
      expect(employees.length).toBe(2); // John Doe y Bob Johnson
      expect(employees.some(e => e.name === 'John Doe')).toBe(true);
      expect(employees.some(e => e.name === 'Bob Johnson')).toBe(true);
    });
  });

  it('should return empty array when search term does not match', () => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    employeeService.getAllEmployee.and.returnValue(of(mockEmployees));

    component.searchItem('xyz');

    component.employees.subscribe(employees => {
      expect(employees.length).toBe(0);
    });
  });

  it('should search case-insensitively', () => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    employeeService.getAllEmployee.and.returnValue(of(mockEmployees));

    component.searchItem('JOHN');

    component.employees.subscribe(employees => {
      expect(employees.length).toBe(1);
      expect(employees[0].name).toBe('John Doe');
    });
  });

  it('should sort employees by name ascending', () => {
    const mockEmployees: Employee[] = [
      new Employee('1', 'Charlie', '2025-11-11T10:00:00'),
      new Employee('2', 'Alice', '2025-11-11T11:00:00'),
      new Employee('3', 'Bob', '2025-11-11T12:00:00')
    ];

    const sorted = component.sortEmployees(mockEmployees);

    expect(sorted[0].name).toBe('Alice');
    expect(sorted[1].name).toBe('Bob');
    expect(sorted[2].name).toBe('Charlie');
  });

  it('should initialize with default sort option', () => {
    expect(component.sortOption).toBe('name-asc');
  });

  it('should set imgLoadingDisplay to none by default', () => {
    expect(component.imgLoadingDisplay).toBe('none');
  });

  it('should handle empty employee list', () => {
    employeeService.getAllEmployee.and.returnValue(of([]));

    component.ngOnInit();

    component.employees.subscribe(employees => {
      expect(employees.length).toBe(0);
    });
  });
});