import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit{

  listUsers: any;
  page: number = 1;
  isLoading: boolean = false;

  constructor(
    private userService:UserService,
    public _sanitizer: DomSanitizer
  ){

  }

  ngOnInit(): void {
    this.getUser();
    
  }

  getUser(){
    this.isLoading = true;
    this.userService.getUsers().subscribe( {
      next:(res)=>{
      this.listUsers = [];
      this.listUsers = res;
    },
    error:(err)=>{
      console.error('Error fetching users', err);
    },
    complete: () => {
      this.isLoading = false;
    }
    })
  }

  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

}
