import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../animal.service';
import { Animal } from '../animal.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
})
export class AnimalComponent implements OnInit {
  animals: Observable<Animal[]> = new Observable<Animal[]>();
  imgLoadingDisplay: string = 'none';
  sortOption: string = 'name-asc'; // Opción de ordenamiento por defecto

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAnimals();
  }

  getAnimals() {
    this.animalService.getAllAnimals().subscribe((res: any) => {
      this.animals = of(this.sortAnimals(res));
    });
    return this.animals;
  }

  addAnimal() {
    this.router.navigate(['/addanimal']);
  }

  deleteAnimal(id: string) {
    this.animalService
      .deleteAnimalById(id)
      .subscribe((result: any) =>
        this.getAnimals().subscribe(
          (resultInner: any) => (this.imgLoadingDisplay = 'none')
        )
      );
    this.imgLoadingDisplay = 'inline';
  }

  editAnimal(id: string) {
    this.router.navigate(['/addanimal'], { queryParams: { id: id } });
  }

  searchItem(value: string) {
    this.animalService.getAllAnimals().subscribe((res: any) => {
      this.animals = of(res);

      this.animals
        .pipe(
          map((plans: any[]) =>
              plans.filter((results: any, emp: number) => 
                results.name.toLowerCase().indexOf(value.toLowerCase()) != -1
              )
          )
        )
        .subscribe((results: any[]) => {
          let animalList: Animal[] = [];
          for (let index = 0; index < results.length; index++) {
            animalList.push(
              new Animal(
                results[index].id,
                results[index].name,
                results[index].createdDate
              )
            );
          }
          this.animals = of(this.sortAnimals(animalList));
        });
    });
  }

  sortAnimals(animals: Animal[]): Animal[] {
    const sortedAnimals = [...animals]; // Crear una copia para no mutar el original
    
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
        return sortedAnimals.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedAnimals.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-asc':
        return sortedAnimals.sort((a, b) => {
          const dateA = parseDate(a.createdDate);
          const dateB = parseDate(b.createdDate);
          return dateA - dateB;
        });
      case 'date-desc':
        return sortedAnimals.sort((a, b) => {
          const dateA = parseDate(a.createdDate);
          const dateB = parseDate(b.createdDate);
          return dateB - dateA;
        });
      default:
        return sortedAnimals;
    }
  }

  onSortChange(event: any) {
    this.sortOption = event.target.value;
    this.animalService.getAllAnimals().subscribe((res: any) => {
    this.animals = of(this.sortAnimals(res));
    });
  }
}
