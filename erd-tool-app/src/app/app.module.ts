import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { AppRoutingModule } from './app-routing.module';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
