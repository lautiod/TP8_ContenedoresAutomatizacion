import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: ComponentFixture<AddemployeeComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getAllEmployee',
      'createEmployee',
      'updateEmployee',
      'getEmployeeById'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [AddemployeeComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: ToastrService, useValue: toastrSpy },
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock de getAllEmployee para devolver lista vacía por defecto
    employeeService.getAllEmployee.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error when name is empty', () => {
      const employee = new Employee(0, '', '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot be empty or contain only spaces.',
        'Validation Error'
      );
    });

    it('should show error when name contains only spaces', () => {
      const employee = new Employee(0, '   ', '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot be empty or contain only spaces.',
        'Validation Error'
      );
    });

    it('should show error when name has less than 2 characters', () => {
      const employee = new Employee(0, 'A', '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name must have at least 2 characters.',
        'Validation Error'
      );
    });

    it('should show error when name exceeds 100 characters', () => {
      const longName = 'A'.repeat(101);
      const employee = new Employee(0, longName, '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot exceed 100 characters.',
        'Validation Error'
      );
    });

    it('should show error when name is duplicate', () => {
      const existingEmployees = [
        new Employee(1, 'Cow Maria', '2025-10-24T10:00:00'),
        new Employee(2, 'Pig Pedro', '2025-10-24T11:00:00')
      ];
      component.allEmployees = existingEmployees;

      const employee = new Employee(0, 'Cow Maria', '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'An animal with this name already exists.',
        'Duplicate Name'
      );
    });

    it('should show error when name is duplicate (case insensitive)', () => {
      const existingEmployees = [
        new Employee(1, 'Cow Maria', '2025-10-24T10:00:00')
      ];
      component.allEmployees = existingEmployees;

      const employee = new Employee(0, 'cow maria', '');
      component.addEmployee(employee);

      expect(toastrService.error).toHaveBeenCalledWith(
        'An animal with this name already exists.',
        'Duplicate Name'
      );
    });

    it('should allow duplicate name when editing the same employee', () => {
      const existingEmployees = [
        new Employee(1, 'Cow Maria', '2025-10-24T10:00:00')
      ];
      component.allEmployees = existingEmployees;
      employeeService.updateEmployee.and.returnValue(of(new Employee(1, 'Cow Maria', '')));

      const employee = new Employee(1, 'Cow Maria', '');
      component.addEmployee(employee);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(employeeService.updateEmployee).toHaveBeenCalled();
    });

    it('should trim spaces from name before saving', () => {
      employeeService.createEmployee.and.returnValue(of(new Employee(1, 'Cow Maria', '')));

      const employee = new Employee(0, '  Cow Maria  ', '');
      component.addEmployee(employee);

      expect(employee.name).toBe('Cow Maria');
      expect(employeeService.createEmployee).toHaveBeenCalled();
    });

    it('should create employee successfully with valid name', () => {
      employeeService.createEmployee.and.returnValue(
        of(new Employee(1, 'Cow Maria', '2025-10-24T10:00:00'))
      );

      const employee = new Employee(0, 'Cow Maria', '');
      component.addEmployee(employee);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(employeeService.createEmployee).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith(
        'Animal created successfully!',
        'Success'
      );
    });

    it('should update employee successfully with valid name', () => {
      employeeService.updateEmployee.and.returnValue(
        of(new Employee(1, 'Cow Maria Updated', '2025-10-24T10:00:00'))
      );

      const employee = new Employee(1, 'Cow Maria Updated', '');
      component.addEmployee(employee);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(employeeService.updateEmployee).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith(
        'Animal updated successfully!',
        'Success'
      );
    });

    it('should accept name with exactly 2 characters', () => {
      employeeService.createEmployee.and.returnValue(of(new Employee(1, 'AB', '')));

      const employee = new Employee(0, 'AB', '');
      component.addEmployee(employee);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(employeeService.createEmployee).toHaveBeenCalled();
    });

    it('should accept name with exactly 100 characters', () => {
      const validName = 'A'.repeat(100);
      employeeService.createEmployee.and.returnValue(of(new Employee(1, validName, '')));

      const employee = new Employee(0, validName, '');
      component.addEmployee(employee);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(employeeService.createEmployee).toHaveBeenCalled();
    });
  });
});
