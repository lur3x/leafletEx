import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private capitalsUrl = '/assets/data/usa-capitals.geojson';

  constructor(private http: HttpClient) {}

  makeCapitalMarkers(): Observable<string> {
    return this.http.get<string>(this.capitalsUrl);
  }
}
