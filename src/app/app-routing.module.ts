import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/partials/page-not-found/page-not-found.component';
import { ListRoleComponent } from './components/list-role/list-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { AuthGuard } from './guards/auth.guard';
import { AfterAuthGuard } from './guards/after-auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { BadgeComponent } from './components/badge/badge/badge.component';
import { FactureComponent } from './components/facture/facture/facture.component';
import { MessageComponent } from './components/message/message/message.component';
import { NotificationComponent } from './components/notification/notification/notification.component';
import { OffreComponent } from './components/offre/offre/offre.component';
import { PaiementComponent } from './components/paiement/paiement/paiement.component';
import { PaysComponent } from './components/pays/pays/pays.component';
import { PhotoComponent } from './components/photo/photo/photo.component';
import { PlaningComponent } from './components/planing/planing/planing.component';
import { ProgrammeComponent } from './components/programme/programme/programme.component';
import { ReservationComponent } from './components/reservation/reservation/reservation.component';
import { ThemeComponent } from './components/theme/theme/theme.component';
import { HomePageComponent } from './components/partials/home-page/home-page.component';

const routes: Routes = [
  {path:"", redirectTo:"/home", pathMatch:'full'},
  {
    path: "home", children:[
      {
        path:"",component:HomePageComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "users", children:[
      {
        path:"",component:ListUserComponent
      },
      
      {
        path:"edit/:id",component: EditUserComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "badges", children:[
      {
        path:"",component:BadgeComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "factures", children:[
      {
        path:"",component:FactureComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "messages", children:[
      {
        path:"",component:MessageComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "notifications", children:[
      {
        path:"",component:NotificationComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "offres", children:[
      {
        path:"",component:OffreComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "paiements", children:[
      {
        path:"",component:PaiementComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "pays", children:[
      {
        path:"",component:PaysComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "photos", children:[
      {
        path:"",component:PhotoComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "planings", children:[
      {
        path:"",component:PlaningComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "programmes", children:[
      {
        path:"",component:ProgrammeComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "reservations", children:[
      {
        path:"",component:ReservationComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path: "themes", children:[
      {
        path:"",component:ThemeComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path:"profile",component:ProfileComponent , canActivate:[AuthGuard]
  },
  {
    path: "roles", children:[
      {
        path:"",component:ListRoleComponent
      },
      {
        path:"createRole",component:AddRoleComponent
      },
      {
        path:"edit/:id",component: EditRoleComponent
      }
    ], canActivate:[AuthGuard]
  },
  {
    path:"login", component:LoginComponent,canActivate:[AfterAuthGuard]
  },
  {
    path:"createUser",component:AddUserComponent
  },
  {
    path:"**", component:PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
