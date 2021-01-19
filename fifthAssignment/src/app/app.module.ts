import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';

@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
