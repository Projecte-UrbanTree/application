import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export class MapService {
  private map!: mapboxgl.Map;
  private draw?: MapboxDraw;

  constructor(container: HTMLDivElement, token: string) {
    mapboxgl.accessToken = token;

    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: [-3.70379, 40.41678],
      zoom: 12,
    });
  }

  public addBasicControls() {
    console.log('ENTRANDO EN BASIC CONTROLS');

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    this.map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'top-right',
    );
  }
  public addGeocoder() {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      marker: true,
      placeholder: 'Buscar una ubicación...',
      zoom: 15,
      mapboxgl: mapboxgl as any,
    });
    this.map.addControl(geocoder, 'top-left');
  }

  public enableDraw(
    isAdmin: boolean,
    onDrawUpdate: (coords: number[][]) => void,
  ) {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });

    this.map.addControl(this.draw);

    this.map.on('draw.create', () => this.handleDraw(onDrawUpdate));
    this.map.on('draw.update', () => this.handleDraw(onDrawUpdate));
    this.map.on('draw.delete', () => this.handleDraw(onDrawUpdate));
  }

  private handleDraw(onDrawUpdate: (coords: number[][]) => void) {
    if (!this.draw) return;
    const data = this.draw.getAll();
    if (data.features.length > 0) {
      const polygon = data.features[0];
      if (polygon.geometry.type === 'Polygon') {
        const coords = polygon.geometry.coordinates[0] ?? [];
        onDrawUpdate(coords as number[][]);
      }
    } else {
      onDrawUpdate([]);
    }
  }

  public isStyleLoaded() {
    return this.map.isStyleLoaded();
  }

  public onceStyleLoad(callback: () => void) {
    this.map.once('style.load', callback);
  }

  public removeLayersAndSources(prefix: string) {
    const style = this.map.getStyle();
    if (!style?.layers) return;

    style.layers.forEach((layer) => {
      if (layer.id.startsWith(prefix)) {
        if (this.map.getLayer(layer.id)) {
          this.map.removeLayer(layer.id);
        }
        if (this.map.getSource(layer.id)) {
          this.map.removeSource(layer.id);
        }
      }
    });
  }

  public addZoneToMap(zoneId: string, coords: number[][]) {
    if (this.map.getSource(zoneId)) {
      if (this.map.getLayer(zoneId)) {
        this.map.removeLayer(zoneId);
      }
      if (this.map.getLayer(`${zoneId}-outline`)) {
        this.map.removeLayer(`${zoneId}-outline`);
      }
      this.map.removeSource(zoneId);
    }

    this.map.addSource(zoneId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
        properties: {},
      },
    });
    this.map.addLayer({
      id: zoneId,
      type: 'fill',
      source: zoneId,
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.5,
      },
    });

    this.map.addLayer({
      id: `${zoneId}-outline`,
      type: 'line',
      source: zoneId,
      paint: {
        'line-color': '#000',
        'line-width': 2,
      },
    });
  }
  public flyTo(coord: [number, number], zoom = 18) {
    this.map.flyTo({ center: coord, zoom, essential: true });
  }
}
