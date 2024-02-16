import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../services/marker.service';
import { Subscription } from 'rxjs';
import { PopUpService } from '../services/popup.service';
import { ShapeService } from '../services/shape.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private states: any;
  private markerSubscription!: Subscription;
  private shapeSubscription!: Subscription;

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }
  constructor(
    private markerService: MarkerService,
    private popupService: PopUpService,
    private shapeService: ShapeService
  ) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  private highlightFeature(e: { target: any }): void {
    const layer = e.target;

    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042',
    });
  }

  private resetFeature(e: { target: any }): void {
    const layer = e.target;

    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B',
    });
  }

  private initStatesLayer(): void {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B',
      }),
      onEachFeature: (feature, layer) =>
        layer.on({
          mouseover: (e) => this.highlightFeature(e),
          mouseout: (e) => this.resetFeature(e),
        }),
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerSubscription = this.markerService
      .makeCapitalMarkers()
      .subscribe((res: any) => {
        const maxPop = Math.max(
          ...res.features.map(
            (x: { properties: { population: any } }) => x.properties.population
          ),
          0
        );
        for (const c of res.features) {
          const lon = c.geometry.coordinates[0];
          const lat = c.geometry.coordinates[1];
          const circle = L.circleMarker([lat, lon], {
            radius: MapComponent.scaledRadius(c.properties.population, maxPop),
          });
          circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));

          circle.addTo(this.map);
        }
      });

    this.shapeSubscription = this.shapeService
      .getStateShapes()
      .subscribe((states) => {
        this.states = states;
        this.initStatesLayer();
      });
  }

  ngOnDestroy(): void {
    if (this.shapeSubscription) {
      this.shapeSubscription.unsubscribe();
    }

    if (this.markerSubscription) {
      this.markerSubscription.unsubscribe();
    }
  }
}
