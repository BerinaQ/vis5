import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';

@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent,
    ScatterPlotComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
