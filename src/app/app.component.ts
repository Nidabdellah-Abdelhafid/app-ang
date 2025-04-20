import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-app';
  apiStatus: 'up' | 'down' | 'checking' = 'checking';
  showAlert: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkApiStatus();
    // Check API status every 30 seconds
    setInterval(() => this.checkApiStatus(), 60000*10);
  }

  private checkApiStatus() {
    this.http.get(`${environment.apiUrl}/actuator/health`).subscribe({
      next: () => {
        this.apiStatus = 'up';
        this.showAlert = false;
      },
      error: () => {
        this.apiStatus = 'down';
        this.showAlert = true;
      }
    });
  }
}