import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee('', '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';
  errorMessage: string = '';
  allEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Cargar todos los empleados para validar duplicados
    this.employeeService.getAllEmployee().subscribe(employees => {
      this.allEmployees = employees;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if(employeeId)
      this.editEmployee(employeeId);
    });
  }

  addEmployee(employee: Employee) {
    // Limpiar mensaje de error anterior
    this.errorMessage = '';

    // Validar que el nombre no esté vacío
    if (!employee.name || employee.name.trim() === '') {
      this.toastr.error('The name cannot be empty or contain only spaces.', 'Validation Error');
      return;
    }

    // Validar longitud mínima (2 caracteres)
    if (employee.name.trim().length < 2) {
      this.toastr.error('The name must have at least 2 characters.', 'Validation Error');
      return;
    }

    // Validar longitud máxima (100 caracteres)
    if (employee.name.trim().length > 100) {
      this.toastr.error('The name cannot exceed 100 characters.', 'Validation Error');
      return;
    }

    // Validar que el nombre no esté duplicado
    const isDuplicate = this.allEmployees.some(emp => 
      emp.name.toLowerCase().trim() === employee.name.toLowerCase().trim() && 
      emp.id !== employee.id
    );

    if (isDuplicate) {
      this.toastr.error('An animal with this name already exists.', 'Duplicate Name');
      return;
    }

    // Si todas las validaciones pasan, guardar el empleado
    employee.name = employee.name.trim(); // Limpiar espacios al inicio y final

    if (employee.id == '' || employee.id == null) {
      employee.createdDate = new Date().toISOString();
      this.employeeService.createEmployee(employee).subscribe({
        next: (result) => {
          this.toastr.success('Animal created successfully!', 'Success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('Failed to create animal. Please try again.', 'Error');
        }
      });
    }
    else {
      employee.createdDate = new Date().toISOString();
      this.employeeService.updateEmployee(employee).subscribe({
        next: (result) => {
          this.toastr.success('Animal updated successfully!', 'Success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('Failed to update animal. Please try again.', 'Error');
        }
      });
    }
    this.submitBtnText = "";
    this.imgLoadingDisplay = 'inline';
  }

  editEmployee(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
