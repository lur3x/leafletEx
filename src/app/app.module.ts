import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './services/marker.service';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PopUpService } from './services/popup.service';
import { ShapeService } from './services/shape.service';

@NgModule({
  declarations: [AppComponent, MapComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [MarkerService, PopUpService, ShapeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
