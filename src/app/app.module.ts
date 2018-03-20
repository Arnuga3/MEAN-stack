import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { GamePortComponent } from './components/gameport/gameport.component';
import { RegisterComponent } from './components/register/register.component';
import { UserService } from './services/user.service';
import { WebSocketService } from './services/websocket.service';
import { BattleFieldComponent } from './components/battlefield/battlefield.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GamePortComponent,
    RegisterComponent,
    BattleFieldComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  // Interceptor to add an auth token
  providers: [
    UserService,
    WebSocketService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
