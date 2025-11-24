import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AnimalComponent } from './animal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { AnimalService } from '../animal.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Animal } from '../animal.model';

describe('AnimalComponent', () => {
  let component: AnimalComponent;
  let fixture: ComponentFixture<AnimalComponent>;
  let animalService: jasmine.SpyObj<AnimalService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const animalServiceSpy = jasmine.createSpyObj('AnimalService', [
      'getAllAnimals',
      'deleteAnimalById'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [AnimalComponent, HttpClientTestingModule],
      providers: [
        DatePipe,
        { provide: AnimalService, useValue: animalServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(AnimalComponent);
    component = fixture.componentInstance;
    animalService = TestBed.inject(AnimalService) as jasmine.SpyObj<AnimalService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock por defecto
    animalService.getAllAnimals.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load animals on init', () => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'John Doe', '2025-11-11T10:00:00'),
      new Animal('2', 'Jane Smith', '2025-11-11T11:00:00')
    ];

    animalService.getAllAnimals.and.returnValue(of(mockAnimals));

    component.ngOnInit();

    component.animals.subscribe(animals => {
      expect(animals.length).toBe(2);
      expect(animals[0].name).toBe('Jane Smith'); // Ordenado por nombre desc por defecto
    });
  });

  it('should navigate to add animal page when addAnimal is called', () => {
    component.addAnimal();
    expect(router.navigate).toHaveBeenCalledWith(['/addanimal']);
  });

  it('should navigate to edit animal page with id', () => {
    const animalId = '123';
    component.editAnimal(animalId);
    expect(router.navigate).toHaveBeenCalledWith(['/addanimal'], { queryParams: { id: animalId } });
  });

  it('should delete animal and reload list', (done) => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    animalService.deleteAnimalById.and.returnValue(of({}));
    animalService.getAllAnimals.and.returnValue(of(mockAnimals));

    component.deleteAnimal('1');

    expect(animalService.deleteAnimalById).toHaveBeenCalledWith('1');
    expect(component.imgLoadingDisplay).toBe('inline');

    setTimeout(() => {
      expect(animalService.getAllAnimals).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should filter animals by search term', () => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'John Doe', '2025-11-11T10:00:00'),
      new Animal('2', 'Jane Smith', '2025-11-11T11:00:00'),
      new Animal('3', 'Bob Johnson', '2025-11-11T12:00:00')
    ];

    animalService.getAllAnimals.and.returnValue(of(mockAnimals));

    component.searchItem('john');

    component.animals.subscribe(animals => {
      expect(animals.length).toBe(2); // John Doe y Bob Johnson
      expect(animals.some(e => e.name === 'John Doe')).toBe(true);
      expect(animals.some(e => e.name === 'Bob Johnson')).toBe(true);
    });
  });

  it('should return empty array when search term does not match', () => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    animalService.getAllAnimals.and.returnValue(of(mockAnimals));

    component.searchItem('xyz');

    component.animals.subscribe(animals => {
      expect(animals.length).toBe(0);
    });
  });

  it('should search case-insensitively', () => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'John Doe', '2025-11-11T10:00:00')
    ];

    animalService.getAllAnimals.and.returnValue(of(mockAnimals));

    component.searchItem('JOHN');

    component.animals.subscribe(animals => {
      expect(animals.length).toBe(1);
      expect(animals[0].name).toBe('John Doe');
    });
  });

  it('should sort animals by name ascending', () => {
    const mockAnimals: Animal[] = [
      new Animal('1', 'Charlie', '2025-11-11T10:00:00'),
      new Animal('2', 'Alice', '2025-11-11T11:00:00'),
      new Animal('3', 'Bob', '2025-11-11T12:00:00')
    ];

  const sorted = component.sortAnimals(mockAnimals);

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

  it('should handle empty animal list', () => {
    animalService.getAllAnimals.and.returnValue(of([]));

    component.ngOnInit();

    component.animals.subscribe(animals => {
      expect(animals.length).toBe(0);
    });
  });
});