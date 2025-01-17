import { Injectable } from '@angular/core';
import { AppServiceService } from '../app_service/app-service.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffreService extends AppServiceService{

  constructor(httpClient:HttpClient) {
    super(environment.apiUrl+"/api/offres",httpClient)
   }

}
