import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';

describe('AppComponent', () => {
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    // Crear un mock del ConfigService
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getEnvName', 'getDbName', 'getApiUrl']);
    mockConfigService.getEnvName.and.returnValue('QA');
    mockConfigService.getDbName.and.returnValue('ISW_DB_QA');
    mockConfigService.getApiUrl.and.returnValue('http://localhost:7150/api/Animal');

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1Text = compiled.querySelector('h1')?.textContent || '';
    if (!h1Text.includes('Farm Animals Management')) {
      fail('Title should contain "Farm Animals Management"');
    }
  });

});