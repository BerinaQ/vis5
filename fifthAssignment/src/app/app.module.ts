import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent,
    LegendComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
