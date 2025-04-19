import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BadgeComponent } from './components/badge/badge/badge.component';
import { ThemeComponent } from './components/theme/theme/theme.component';
import { ReservationComponent } from './components/reservation/reservation/reservation.component';
import { ProgrammeComponent } from './components/programme/programme/programme.component';
import { PlaningComponent } from './components/planing/planing/planing.component';
import { PhotoComponent } from './components/photo/photo/photo.component';
import { PaysComponent } from './components/pays/pays/pays.component';
import { PaiementComponent } from './components/paiement/paiement/paiement.component';
import { OffreComponent } from './components/offre/offre/offre.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { MessageComponent } from './components/message/message/message.component';
import { FactureComponent } from './components/facture/facture/facture.component';
import { HomePageComponent } from './components/partials/home-page/home-page.component';
import { CeilPipe } from './pipes/ceil.pipe';
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
    ProfileComponent,
    BadgeComponent,
    ThemeComponent,
    ReservationComponent,
    ProgrammeComponent,
    PlaningComponent,
    PhotoComponent,
    PaysComponent,
    PaiementComponent,
    OffreComponent,
    NotificationComponent,
    MessageComponent,
    FactureComponent,
    HomePageComponent,
    CeilPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule
    
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
