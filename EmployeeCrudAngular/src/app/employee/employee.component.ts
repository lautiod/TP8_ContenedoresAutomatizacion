import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employees: Observable<Employee[]> = new Observable<Employee[]>();
  imgLoadingDisplay: string = 'none';
  sortOption: string = 'name-asc'; // Opción de ordenamiento por defecto

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEmployess();
  }

  getEmployess() {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employees = of(this.sortEmployees(res));
    });
    return this.employees;
  }

  addEmployee() {
    this.router.navigate(['/addemployee']);
  }

  deleteEmployee(id: number) {
    this.employeeService
      .deleteEmployeeById(id)
      .subscribe((result) =>
        this.getEmployess().subscribe(
          (result) => (this.imgLoadingDisplay = 'none')
        )
      );
    this.imgLoadingDisplay = 'inline';
  }

  editEmployee(id: number) {
    this.router.navigate(['/addemployee'], { queryParams: { id: id } });
  }

  searchItem(value: string) {
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employees = of(res);

      this.employees
        .pipe(
          map((plans) =>
              plans.filter((results, emp) => 
                results.name.toLowerCase().indexOf(value.toLowerCase()) != -1
              )
          )
        )
        .subscribe((results) => {
          let employeeList: Employee[] = [];
          for (let index = 0; index < results.length; index++) {
            employeeList.push(
              new Employee(
                results[index].id,
                results[index].name,
                results[index].createdDate
              )
            );
          }
          this.employees = of(this.sortEmployees(employeeList));
        });
    });
  }

  sortEmployees(employees: Employee[]): Employee[] {
    const sortedEmployees = [...employees]; // Crear una copia para no mutar el original
    
    // Función para convertir fecha a timestamp (soporta ISO y DD/MM/YYYY HH:mm:ss)
    const parseDate = (dateString: string | undefined): number => {
      if (!dateString) return 0;
      const trimmed = dateString.trim();
      // 1) Intentar parseo nativo (ISO: yyyy-MM-ddTHH:mm:ss)
      const iso = new Date(trimmed);
      if (!isNaN(iso.getTime())) return iso.getTime();

      // 2) Intentar formato DD/MM/YYYY HH:mm:ss
      try {
        const [datePart, timePart] = trimmed.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart ? timePart.split(':') : ['0', '0', '0'];
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
        );
        return isNaN(date.getTime()) ? 0 : date.getTime();
      } catch {
        return 0;
      }
    };
    
    switch (this.sortOption) {
      case 'name-asc':
        return sortedEmployees.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedEmployees.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-asc':
        return sortedEmployees.sort((a, b) => {
          const dateA = parseDate(a.createdDate);
          const dateB = parseDate(b.createdDate);
          return dateA - dateB;
        });
      case 'date-desc':
        return sortedEmployees.sort((a, b) => {
          const dateA = parseDate(a.createdDate);
          const dateB = parseDate(b.createdDate);
          return dateB - dateA;
        });
      default:
        return sortedEmployees;
    }
  }

  onSortChange(event: any) {
    this.sortOption = event.target.value;
    this.employeeService.getAllEmployee().subscribe((res) => {
      this.employees = of(this.sortEmployees(res));
    });
  }
}
