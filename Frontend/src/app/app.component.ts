import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Farm Animals Management';
  
  get envName(): string {
    return this.configService.getEnvName();
  }
  
  get dbName(): string {
    return this.configService.getDbName();
  }

  constructor(private configService: ConfigService) {}
}
