import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    
  }

  addUser(data:FormData){
    return this.http.post(`${environment.apiUrl}/users/createUser`, data);
  }

  addRoleToUser(data:any){
    return this.http.post(`${environment.apiUrl}/addRoleToUser`, data);
  }

  getUsers(){
    return this.http.get(`${environment.apiUrl}/users`);
  }

  
}
