import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyC0bhIEMKfNuBKu4Vp5WwGYoZW2GWJGfaY",
      authDomain: "magic-173de.firebaseapp.com",
      databaseURL: "https://magic-173de-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "magic-173de",
      storageBucket: "magic-173de.appspot.com",
      messagingSenderId: "843032359293",
      appId: "1:843032359293:web:cf9b2d1cfe9dc26dfd5c14"
    }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
