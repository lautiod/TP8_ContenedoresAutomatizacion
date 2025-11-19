import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment'; // Importa el environment


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrlEmployee = environment.apiUrl;  // Usa el valor de environment

  constructor(private http: HttpClient, private datepipe: DatePipe) {}

  getAllEmployee(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.apiUrlEmployee + '/getall')
      .pipe(
  map((data: Employee[]) =>
    data.map((item: Employee) => {
      let parsedDate: Date | null = null;

      if (typeof item.createdDate === 'string' && item.createdDate) {
        // Si viene como "23/10/2025 19:45:35"
        if (item.createdDate.includes('/')) {
          const [datePart, timePart] = item.createdDate.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);
          parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
        } else {
          // Si viene en otro formato (ej. ISO)
          parsedDate = new Date(item.createdDate);
        }
      }

      return new Employee(
        item.id,
        item.name,
        parsedDate
          ? this.datepipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm:ss', undefined)?.toString()
          : ''
      );
    })
  )
);
  }


  getEmployeeById(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(
      this.apiUrlEmployee + '/getbyid/?id=' + employeeId
    );
  }
  createEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    // En creación, no enviar id ni createdDate: los genera el backend/DB
    const payload = { name: employee.name } as any;
    return this.http.post<Employee>(
      this.apiUrlEmployee + '/create',
      payload,
      httpOptions
    );
  }
  updateEmployee(employee: Employee): Observable<Employee> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    // En actualización, enviar id por querystring y sólo los campos editables en el cuerpo
    const payload = { name: employee.name } as any;
    return this.http.put<Employee>(
      this.apiUrlEmployee + '/update/?id=' + employee.id,
      payload,
      httpOptions
    );
  }

  deleteEmployeeById(employeeid: string) {
    return this.http.delete(this.apiUrlEmployee + '/delete/?id=' + employeeid);
  }
}
