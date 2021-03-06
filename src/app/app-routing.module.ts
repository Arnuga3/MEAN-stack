import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePortComponent } from './components/gameport/gameport.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ShopComponent } from './components/shop/shop.component';

// Define paths and components to load
const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/gameport', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { state: 'login' }  },
  { path: 'register', component: RegisterComponent, data: { state: 'register' }  },
  { path: 'gameport', component: GamePortComponent,  data: { state: 'gameport' }  },
  { path: 'scoreboard', component: ScoreboardComponent,  data: { state: 'scoreboard' }  },
  { path: 'shop', component: ShopComponent,  data: { state: 'shop' }  }
];

@NgModule({
  // Configure the router at the application's root level
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
