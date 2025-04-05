import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { Icon } from '@iconify/react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { Point, TypePoint } from '@/types/Point';
import { TreeTypes } from '@/types/TreeTypes';

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

  public enableDraw(isAdmin: boolean, onDrawUpdate: (coords: number[][]) => void) {
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

  public enableSingleClick(callback: (lngLat: { lng: number; lat: number }) => void) {
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
    if (!this.map || !this.map.isStyleLoaded()) {
      return;
    }

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

  public addZoneToMap(zoneId: string, coordinates: number[][], color: string) {
    const sourceId = `zone-${zoneId}`;
    const layerId = `zone-${zoneId}-fill`;

    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }

    this.map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    });

    this.map.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': color,
        'fill-opacity': 0.5
      },
    });
  }

  private getPolygonCenter(coordinates: number[][]): [number, number] {
    const lngs = coordinates.map(coord => coord[0]);
    const lats = coordinates.map(coord => coord[1]);
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    return [centerLng, centerLat];
  }

  private createCustomMarkerElement(elementType: ElementType): HTMLElement {
    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);

    const iconName = elementType.icon?.trim()
      ? elementType.icon.includes(':')
        ? elementType.icon
        : `mdi:${elementType.icon}`
      : 'mdi:map-marker';

    const bgColor = elementType.color
      ? elementType.color.startsWith('#')
        ? elementType.color
        : `#${elementType.color}`
      : '#2D4356';

    root.render(
      React.createElement(
        'div',
        {
          className: 'element-marker',
          style: {
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            boxShadow: '0 3px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.22)',
            cursor: 'pointer',
            border: '2px solid #fff',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          },
          onMouseEnter: (e: any) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow =
              '0 5px 10px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.22)';
          },
          onMouseLeave: (e: any) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow =
              '0 3px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.22)';
          },
        },
        React.createElement(Icon, {
          icon: iconName,
          width: 22,
          height: 22,
          color: '#FFFFFF',
        }),
      ),
    );

    return container;
  }

  public addElementMarkers(
    elements: Element[],
    points: Point[],
    treeTypes: TreeTypes[],
    elementTypes: ElementType[],
    onDeleteElement?: (elementId: number) => void,
    onElementClick?: (element: Element) => void,
  ) {
    this.removeElementMarkers();

    elements.forEach((element) => {
      const point = points.find((p) => p.id === element.point_id);
      if (!point?.latitude || !point?.longitude) return;

      const elementType = elementTypes.find((et) => et.id === element.element_type_id);
      if (!elementType) return;

      const markerElement = this.createCustomMarkerElement(elementType);
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat([point.longitude, point.latitude])
        .addTo(this.map);

      if (onElementClick) {
        marker.getElement().addEventListener('click', () => {
          onElementClick(element);
        });
      }

      this.elementMarkers.push({ marker, elementId: element.id! });
    });
  }

  public removeElementMarker(elementId: number) {
    const markerObj = this.elementMarkers.find((m) => m.elementId === elementId);
    if (markerObj) {
      markerObj.marker.remove();
      this.elementMarkers = this.elementMarkers.filter((m) => m.elementId !== elementId);
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
    if (!point || point.latitude === undefined || point.longitude === undefined) {
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
    const markerObj = this.elementMarkers.find((m) => m.elementId === elementId);
    if (markerObj) {
      const markerElement = markerObj.marker.getElement();
      markerElement.style.display = visible ? '' : 'none';
    }
  }
}
