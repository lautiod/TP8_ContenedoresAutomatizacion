import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from './animal.model';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  apiUrlAnimal = environment.apiUrl;

  constructor(private http: HttpClient, private datepipe: DatePipe) {}

  getAllAnimals(): Observable<Animal[]> {
    return this.http
      .get<Animal[]>(`${this.apiUrlAnimal}/getall`)
      .pipe(
        map((data: Animal[]) =>
          data.map((item: Animal) => {
            let parsedDate: Date | null = null;

            if (typeof item.createdDate === 'string' && item.createdDate) {
              if (item.createdDate.includes('/')) {
                const [datePart, timePart] = item.createdDate.split(' ');
                const [day, month, year] = datePart.split('/').map(Number);
                const [hours, minutes, seconds] = timePart.split(':').map(Number);
                parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
              } else {
                parsedDate = new Date(item.createdDate);
              }
            }

            return new Animal(
              item.id,
              item.name,
              parsedDate
                ? this.datepipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm:ss')?.toString()
                : ''
            );
          })
        )
      );
  }

  getAnimalById(animalId: string): Observable<Animal> {
    return this.http.get<Animal>(
      `${this.apiUrlAnimal}/getbyid?id=${animalId}`
    );
  }

  createAnimal(animal: Animal): Observable<Animal> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const payload = { name: animal.name };
    return this.http.post<Animal>(
      `${this.apiUrlAnimal}/create`,
      payload,
      httpOptions
    );
  }

  updateAnimal(animal: Animal): Observable<Animal> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const payload = { name: animal.name };
    return this.http.put<Animal>(
      `${this.apiUrlAnimal}/update?id=${animal.id}`,
      payload,
      httpOptions
    );
  }

  deleteAnimalById(animalid: string) {
    return this.http.delete(`${this.apiUrlAnimal}/delete?id=${animalid}`);
  }
}
