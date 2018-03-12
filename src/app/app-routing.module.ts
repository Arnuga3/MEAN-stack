import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Define paths and components to load
const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { state: 'login' }  },
  { path: 'register', component: RegisterComponent, data: { state: 'register' }  },
  { path: 'game', component: GameComponent,  data: { state: 'game' }  }
];

@NgModule({
  // Configure the router at the application's root level
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
