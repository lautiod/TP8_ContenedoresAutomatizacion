import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnimalService } from './animal.service';
import { Animal } from './animal.model';
import { DatePipe } from '@angular/common';

describe('AnimalService', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;
  let datePipe: DatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnimalService,
        DatePipe
      ]
    });

    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
    datePipe = TestBed.inject(DatePipe);
  });

  afterEach(() => {
    httpMock.verify();
  });



  it('should retrieve all animals', () => {
    const today = new Date();
    const expectedDateTime = datePipe.transform(today, 'dd/MM/yyyy HH:mm:ss', undefined) ?? '';  // Formato del backend

    // Los datos que vienen del backend (simulados)
    const mockBackendAnimals: Animal[] = [
      new Animal('1', 'John Doe', expectedDateTime),
      new Animal('2', 'Jane Smith', expectedDateTime)
    ];

    // Los datos esperados después de la transformación del servicio
    const expectedFormattedDate = datePipe.transform(today, 'yyyy-MM-ddTHH:mm:ss', undefined) ?? '';

    service.getAllAnimals().subscribe((animals: Animal[]) => {
      expect(animals.length).toBe(2);
      animals.forEach((animal: Animal, index: number) => {
        // Agrega depuración aquí
        console.log('Animal createdDate:', animal.createdDate);
        console.log('Expected formatted date:', expectedFormattedDate);

        // Comparar directamente los strings de fecha ya formateados
        expect(animal.createdDate).toBeTruthy();
        expect(animal.name).toBe(mockBackendAnimals[index].name);
        // Verificar que ambas fechas están en el formato correcto (yyyy-MM-ddTHH:mm:ss)
        expect(animal.createdDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBackendAnimals);
  });

  it('should return empty array when backend returns empty list', () => {
    service.getAllAnimals().subscribe((animals: Animal[]) => {
      expect(animals.length).toBe(0);
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush([]); // backend responde lista vacía
  });

  it('should propagate http error', () => {
    const status = 500;
    const statusText = 'Internal Server Error';

    service.getAllAnimals().subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'boom' }, { status, statusText });
  });

  it('should parse mixed date formats (dd/MM/yyyy HH:mm:ss and ISO)', () => {
    const datePipeLocal = datePipe;
    const now = new Date('2025-05-01T13:45:30Z');
    const legacyFormat = datePipeLocal.transform(now, 'dd/MM/yyyy HH:mm:ss', undefined) ?? '';
    const isoFormat = now.toISOString();

    const mockBackendAnimals: any[] = [
      { id: '1', name: 'Legacy', createdDate: legacyFormat },
      { id: '2', name: 'Iso', createdDate: isoFormat }
    ];

    service.getAllAnimals().subscribe((animals: Animal[]) => {
      expect(animals.length).toBe(2);
      animals.forEach((e: Animal) => {
        expect(e.createdDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/getall`);
    req.flush(mockBackendAnimals);
  });

  // ==================== Tests adicionales para otros métodos ====================

  it('should create an animal', () => {
    const newAnimal = new Animal('', 'New Animal', '2025-11-11T10:00:00');
    const createdAnimal = new Animal('123', 'New Animal', '2025-11-11T10:00:00');

    service.createAnimal(newAnimal).subscribe((animal: Animal) => {
      expect(animal).toEqual(createdAnimal);
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: newAnimal.name });
    req.flush(createdAnimal);
  });

  it('should update an animal', () => {
    const animalId = '123';
    const updatedAnimal = new Animal(animalId, 'Updated Name', '2025-11-11T10:00:00');

    service.updateAnimal(updatedAnimal).subscribe();

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/update?id=${animalId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: updatedAnimal.name });
    req.flush(null);
  });

  it('should delete an animal by id', () => {
    const animalId = '123';

    service.deleteAnimalById(animalId).subscribe();

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/delete?id=${animalId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get animal by id', () => {
    const animalId = '123';
    const animal = new Animal(animalId, 'John Doe', '2025-11-11T10:00:00');

    service.getAnimalById(animalId).subscribe((result: Animal) => {
      expect(result).toEqual(animal);
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/getbyid?id=${animalId}`);
    expect(req.request.method).toBe('GET');
    req.flush(animal);
  });

  it('should handle error when creating animal fails', () => {
    const newAnimalErr = new Animal('', 'New Animal', '2025-11-11T10:00:00');
    const status = 400;
    const statusText = 'Bad Request';

    service.createAnimal(newAnimalErr).subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
        expect(err.statusText).toBe(statusText);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/create`);
    req.flush({ message: 'Invalid data' }, { status, statusText });
  });

  it('should handle error when deleting animal fails', () => {
    const animalId = '123';
    const status = 404;
    const statusText = 'Not Found';

    service.deleteAnimalById(animalId).subscribe({
      next: () => fail('Should not emit success'),
      error: (err) => {
        expect(err.status).toBe(status);
      }
    });

    const req = httpMock.expectOne(`${service.apiUrlAnimal}/delete?id=${animalId}`);
    req.flush({ message: 'Animal not found' }, { status, statusText });
  });


});