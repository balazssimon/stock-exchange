import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }  from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';


@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    //AppRoutingModule,
    HttpModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap:    [ AppComponent ],
  providers: [ ]
})
export class AppModule { }
