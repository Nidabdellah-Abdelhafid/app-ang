import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(
    @Inject(environment.apiUrl) private url: string,
    private http: HttpClient) { 
  }

  getAll(){
    return this.http.get(this.url);
  }

  create(resource:any){
    return this.http.post(this.url, resource);
  }

  update(resource:any){
    return this.http.put(this.url+'/'+resource.id, resource);
  }

  delete(resource:any){

    return this.http.delete(this.url+'/'+resource.id);

  }

  getProgrammeWithDetails(){
    return this.http.get(environment.apiUrl+"/api/programmes/details");
  }

  addThemeToOffre(data:any){
    return this.http.post(environment.apiUrl+"/api/offres/addThemeToOffre",data);
  }

  addBadgeToOffre(data:any){
    return this.http.post(environment.apiUrl+"/api/offres/addBadgeToOffre",data);
  }

}
