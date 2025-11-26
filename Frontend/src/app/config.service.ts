import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config.json')
      );
      console.log('Configuration loaded:', this.config);
    } catch (error) {
      console.error('Failed to load configuration, using defaults', error);
      // Fallback a configuración por defecto si falla
      this.config = {
        apiUrl: 'http://localhost:7150'
      };
    }
  }

  getApiUrl(): string {
    if (!this.config) {
      console.warn('Configuration not loaded yet, using default');
      return 'http://localhost:7150';
    }
    return this.config.apiUrl;
  }
}
