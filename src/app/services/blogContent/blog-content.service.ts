import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppServiceService } from '../app_service/app-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogContentService extends AppServiceService{

  constructor(httpClient:HttpClient) {
    super(environment.apiUrl+"/api/blog-contents",httpClient)
   }

}
