import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit{

  listUsers:any;
  page: number = 1;

  constructor(
    private userService:UserService,
    public _sanitizer: DomSanitizer
  ){

  }

  ngOnInit(): void {

    this.userService.getUsers().subscribe(res=>{
      this.listUsers = res;
    })
  }

  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

}
