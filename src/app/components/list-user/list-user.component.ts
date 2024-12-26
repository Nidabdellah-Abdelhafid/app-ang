import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit{

  listUsers:any;
  page: number = 1;

  constructor(
    private userService:UserService
  ){

  }

  ngOnInit(): void {

    this.userService.getUsers().subscribe(res=>{
      this.listUsers = res;
    })
  }

}
