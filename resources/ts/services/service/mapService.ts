import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { Point, TypePoint } from '@/types/Point';
import { TreeType } from '@/types/TreeType';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapService {
  public map!: mapboxgl.Map;
  private draw?: MapboxDraw;
  private singleClickListener?: (e: mapboxgl.MapMouseEvent) => void;
  private elementMarkers: { marker: mapboxgl.Marker; elementId: number }[] = [];

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
    if (!isAdmin) return;
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });

    this.map.addControl(this.draw);

    this.map.on('draw.create', () => this.handleDraw(onDrawUpdate));
    this.map.on('draw.update', () => this.handleDraw(onDrawUpdate));
    this.map.on('draw.delete', () => this.handleDraw(onDrawUpdate));
  }

  public clearDraw(): void {
    this.draw?.deleteAll();
  }

  private handleDraw(onDrawUpdate: (coords: number[][]) => void) {
    if (!this.draw) return;
    const data = this.draw.getAll();

    if (data.features.length > 0) {
      const polygon = data.features[0];
      if (polygon.geometry.type === 'Polygon') {
        const coords = polygon.geometry.coordinates[0] ?? [];

        if (coords.length < 3) {
          if (polygon.id) {
            this.draw.delete(polygon.id as string);
          }
          onDrawUpdate([]);
          return;
        }

        onDrawUpdate(coords as number[][]);
      }
    } else {
      onDrawUpdate([]);
    }
  }

  public enableSingleClick(
    callback: (lngLat: { lng: number; lat: number }) => void,
  ) {
    this.disableSingleClick();

    this.singleClickListener = (e) => {
      callback(e.lngLat);
    };

    this.map.on('click', this.singleClickListener);
  }

  public disableSingleClick() {
    if (this.singleClickListener) {
      this.map.off('click', this.singleClickListener);
      this.singleClickListener = undefined;
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
      }
    });

    style.layers.forEach((layer) => {
      if (layer.id.startsWith(prefix)) {
        if (this.map.getSource(layer.id)) {
          this.map.removeSource(layer.id);
        }
      }
    });
  }

  public addZoneToMap(
    zoneId: string,
    coords: number[][],
    zoneColor: string = '#088',
  ) {
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
        'fill-color': zoneColor,
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

  public addElementMarkers(
    elements: Element[],
    points: Point[],
    treeTypes: TreeType[],
    elementTypes: ElementType[],
    onDeleteElement?: (elementId: number) => void,
    onElementClick?: (element: Element) => void,
  ) {
    this.removeElementMarkers();
    const filteredPoints = points.filter((p) => p.type === TypePoint.element);

    elements.forEach((element) => {
      const coords = this.getCoordElement(element, filteredPoints);
      if (!coords) {
        console.warn('Elemento sin coordenadas:', element);
        return;
      }

      const marker = new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([coords.lng, coords.lat])
        .addTo(this.map);

      marker.getElement().addEventListener('click', () => {
        if (onElementClick) {
          onElementClick(element);
        }
      });

      this.elementMarkers.push({ marker, elementId: element.id! });
    });
  }

  public removeElementMarker(elementId: number) {
    const markerObj = this.elementMarkers.find(
      (m) => m.elementId === elementId,
    );
    if (markerObj) {
      markerObj.marker.remove();
      this.elementMarkers = this.elementMarkers.filter(
        (m) => m.elementId !== elementId,
      );
    }
  }

  public removeElementMarkers() {
    this.elementMarkers.forEach((markerObj) => markerObj.marker.remove());
    this.elementMarkers = [];
  }

  public getCoordElement(
    element: Element,
    points: Point[],
  ): { lat: number; lng: number } | null {
    const point = points.find((p) => p.id === element.point_id);
    if (
      !point ||
      point.latitude === undefined ||
      point.longitude === undefined
    ) {
      return null;
    }
    return { lat: point.latitude, lng: point.longitude };
  }

  public flyTo(coord: [number, number], zoom = 16) {
    this.map.flyTo({ center: coord, zoom, essential: true });
  }

  public resizeMap(): void {
    if (this.map) {
      this.map.resize();
    }
  }

  public updateMarkerVisibility(elementId: number, visible: boolean) {
    const markerObj = this.elementMarkers.find(
      (m) => m.elementId === elementId,
    );
    if (markerObj) {
      const markerElement = markerObj.marker.getElement();
      if (visible) {
        markerElement.style.display = '';
      } else {
        markerElement.style.display = 'none';
      }
    }
  }
}
