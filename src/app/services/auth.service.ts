import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

   }

   login(data :{ email: string,password:string}){
    return this.http.post(
      `${environment.apiUrl}/login`,  
      JSON.stringify(data), 
      {
        headers: {
          'Content-Type': 'application/json' 
        }
      }
    );

   }

   logOutTkn(){
    return this.http.get(
      `${environment.apiUrl}/refreshToken`
    )
   }

   getAuthUser(){
    return this.http.get(
      `${environment.apiUrl}/profile`
    )
   }

   updateUser(id:number,userData:any){
    return this.http.put(
      `${environment.apiUrl}/profile/${id}`,
      userData
    )
   }

}
