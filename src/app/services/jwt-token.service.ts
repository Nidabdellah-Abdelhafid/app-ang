import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor() { }

  set(data:any){
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('email', data.email);

  }

  handle(data:any){
    this.set(data);
  }

  getAccess_token(){
    return localStorage.getItem('access_token');
  }

  getRefresh_token(){
    return localStorage.getItem('refresh_token');
  }

  getEmail(){
    return localStorage.getItem('email');
  }

  remove(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
  }

  decode(payload:any){
    return JSON.parse(atob(payload))
  }

  payload(accessToken:any){
    const payload = accessToken.split('.')[1];
    return this.decode(payload);
  }

  isValide(){
    const access_token = this.getAccess_token();
    const email = this.getEmail();

    if(access_token){
      const payload = this.payload(access_token);
      if(payload){
        return email == payload.sub;
      }
    }
    return false;
  }

  getInfos(){
    const access_token = this.getAccess_token();
    
    if(access_token){
      const payload = this.payload(access_token);
      
      return payload ? payload : null;
    }
      return null;
  }

  loggedIn(){
    return this.isValide();
  }

}
