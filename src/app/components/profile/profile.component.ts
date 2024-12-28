import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  
  authUser:any;

  constructor(private authService:AuthService,
    public _sanitizer: DomSanitizer
  ){

  }
  ngOnInit(): void {
    this.authService.getAuthUser().subscribe(res=>{
      this.authUser= res;
    })
  }

  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

}
