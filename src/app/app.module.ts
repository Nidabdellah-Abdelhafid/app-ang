import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { ListRoleComponent } from './components/list-role/list-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { NavbarComponent } from './components/partials/navbar/navbar.component';
import { PageNotFoundComponent } from './components/partials/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorInterceptor } from './services/jwt-interceptor.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    EditUserComponent,
    ListUserComponent,
    AddRoleComponent,
    ListRoleComponent,
    EditRoleComponent,
    NavbarComponent,
    PageNotFoundComponent,
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    
    
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
