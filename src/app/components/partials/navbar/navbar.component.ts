import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { JwtTokenService } from '../../../services/jwt-token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: any = null;
  isAdmin: boolean = false;  // To track if the user is an admin
  adminMenuItems: string[] = ['users', 'roles', 'paiements', 'factures'];
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.authStatus.subscribe(res => {
      this.currentUser = this.jwtTokenService.getInfos();
      if (this.currentUser && this.currentUser.roles) {
        this.isAdmin = this.currentUser.roles.includes('ADMIN'); 
      }
    });
  }

  logOut(): void {
    this.authService.logOutTkn().subscribe(res => { return; });
    this.jwtTokenService.remove();
    this.accountService.changeStatus(false);
    this.router.navigateByUrl("/login");
  }
}
