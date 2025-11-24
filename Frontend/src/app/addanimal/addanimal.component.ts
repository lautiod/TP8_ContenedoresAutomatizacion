import { Component, OnInit } from '@angular/core';
import { Animal } from '../animal.model';
import { AnimalService } from '../animal.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addanimal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addanimal.component.html',
  styleUrls: ['./addanimal.component.css']
})
export class AddanimalComponent implements OnInit {
  newAnimal: Animal = new Animal('', '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';
  errorMessage: string = '';
  allAnimals: Animal[] = [];

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Cargar todos los animales para validar duplicados
    this.animalService.getAllAnimals().subscribe((animals: any) => {
      this.allAnimals = animals;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      const animalId = params['id'];
      if(animalId)
      this.editAnimal(animalId);
    });
  }

  addAnimal(animal: Animal) {
    // Limpiar mensaje de error anterior
    this.errorMessage = '';

    // Validar que el nombre no esté vacío
    if (!animal.name || animal.name.trim() === '') {
      this.toastr.error('The name cannot be empty or contain only spaces.', 'Validation Error');
      return;
    }

    // Validar longitud mínima (2 caracteres)
    if (animal.name.trim().length < 2) {
      this.toastr.error('The name must have at least 2 characters.', 'Validation Error');
      return;
    }

    // Validar longitud máxima (100 caracteres)
    if (animal.name.trim().length > 100) {
      this.toastr.error('The name cannot exceed 100 characters.', 'Validation Error');
      return;
    }

    // Validar que el nombre no esté duplicado
    const isDuplicate = this.allAnimals.some(emp => 
      emp.name.toLowerCase().trim() === animal.name.toLowerCase().trim() && 
      emp.id !== animal.id
    );

    if (isDuplicate) {
      this.toastr.error('An animal with this name already exists.', 'Duplicate Name');
      return;
    }

  // Si todas las validaciones pasan, guardar el animal
  animal.name = animal.name.trim(); // Limpiar espacios al inicio y final

    if (animal.id == '' || animal.id == null) {
      animal.createdDate = new Date().toISOString();
      this.animalService.createAnimal(animal).subscribe({
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
      animal.createdDate = new Date().toISOString();
      this.animalService.updateAnimal(animal).subscribe({
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

  editAnimal(animalId: string) {
    this.animalService.getAnimalById(animalId).subscribe(res => {
      this.newAnimal.id = res.id;
      this.newAnimal.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
