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
import { GameComponent } from './components/game/game.component';
import { RegisterComponent } from './components/register/register.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserService } from './services/user.service';
import { WebSocketService } from './services/websocket.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    RegisterComponent,
    UserViewComponent
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
