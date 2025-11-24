import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddanimalComponent } from './addanimal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AnimalService } from '../animal.service';
import { Animal } from '../animal.model';

describe('AddanimalComponent', () => {
  let component: AddanimalComponent;
  let fixture: ComponentFixture<AddanimalComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let animalService: jasmine.SpyObj<AnimalService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    const animalServiceSpy = jasmine.createSpyObj('AnimalService', [
      'getAllAnimals',
      'createAnimal',
      'updateAnimal',
      'getAnimalById'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [AddanimalComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: ToastrService, useValue: toastrSpy },
        { provide: AnimalService, useValue: animalServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AddanimalComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    animalService = TestBed.inject(AnimalService) as jasmine.SpyObj<AnimalService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock de getAllAnimals para devolver lista vacía por defecto
    animalService.getAllAnimals.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show error when name is empty', () => {
      const animal = new Animal('', '', '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot be empty or contain only spaces.',
        'Validation Error'
      );
    });

    it('should show error when name contains only spaces', () => {
      const animal = new Animal('', '   ', '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot be empty or contain only spaces.',
        'Validation Error'
      );
    });

    it('should show error when name has less than 2 characters', () => {
      const animal = new Animal('', 'A', '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name must have at least 2 characters.',
        'Validation Error'
      );
    });

    it('should show error when name exceeds 100 characters', () => {
      const longName = 'A'.repeat(101);
      const animal = new Animal('', longName, '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'The name cannot exceed 100 characters.',
        'Validation Error'
      );
    });

    it('should show error when name is duplicate', () => {
      const existingAnimals = [
        new Animal('1', 'Cow Maria', '2025-10-24T10:00:00'),
        new Animal('2', 'Pig Pedro', '2025-10-24T11:00:00')
      ];
      component.allAnimals = existingAnimals;

      const animal = new Animal('', 'Cow Maria', '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'An animal with this name already exists.',
        'Duplicate Name'
      );
    });

    it('should show error when name is duplicate (case insensitive)', () => {
      const existingAnimals = [
        new Animal('1', 'Cow Maria', '2025-10-24T10:00:00')
      ];
      component.allAnimals = existingAnimals;

      const animal = new Animal('', 'cow maria', '');
      component.addAnimal(animal);

      expect(toastrService.error).toHaveBeenCalledWith(
        'An animal with this name already exists.',
        'Duplicate Name'
      );
    });

    it('should allow duplicate name when editing the same animal', () => {
      const existingAnimals = [
        new Animal('1', 'Cow Maria', '2025-10-24T10:00:00')
      ];
      component.allAnimals = existingAnimals;
      animalService.updateAnimal.and.returnValue(of(new Animal('1', 'Cow Maria', '')));

      const animal = new Animal('1', 'Cow Maria', '');
      component.addAnimal(animal);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(animalService.updateAnimal).toHaveBeenCalled();
    });

    it('should trim spaces from name before saving', () => {
      animalService.createAnimal.and.returnValue(of(new Animal('1', 'Cow Maria', '')));

      const animal = new Animal('', '  Cow Maria  ', '');
      component.addAnimal(animal);

      expect(animal.name).toBe('Cow Maria');
      expect(animalService.createAnimal).toHaveBeenCalled();
    });

    it('should create animal successfully with valid name', () => {
      animalService.createAnimal.and.returnValue(
        of(new Animal('1', 'Cow Maria', '2025-10-24T10:00:00'))
      );

      const animal = new Animal('', 'Cow Maria', '');
      component.addAnimal(animal);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(animalService.createAnimal).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith(
        'Animal created successfully!',
        'Success'
      );
    });

    it('should update animal successfully with valid name', () => {
      animalService.updateAnimal.and.returnValue(
        of(new Animal('1', 'Cow Maria Updated', '2025-10-24T10:00:00'))
      );

      const animal = new Animal('1', 'Cow Maria Updated', '');
      component.addAnimal(animal);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(animalService.updateAnimal).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith(
        'Animal updated successfully!',
        'Success'
      );
    });

    it('should accept name with exactly 2 characters', () => {
      animalService.createAnimal.and.returnValue(of(new Animal('1', 'AB', '')));

      const animal = new Animal('', 'AB', '');
      component.addAnimal(animal);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(animalService.createAnimal).toHaveBeenCalled();
    });

    it('should accept name with exactly 100 characters', () => {
      const validName = 'A'.repeat(100);
      animalService.createAnimal.and.returnValue(of(new Animal('1', validName, '')));

      const animal = new Animal('', validName, '');
      component.addAnimal(animal);

      expect(toastrService.error).not.toHaveBeenCalled();
      expect(animalService.createAnimal).toHaveBeenCalled();
    });
  });
});
