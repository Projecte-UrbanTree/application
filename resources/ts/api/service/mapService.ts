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
import { Point } from '@/types/Point';
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

  public addBasicControls(): void {
    const { map } = this;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'top-right',
    );
  }

  public addGeocoder(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      marker: true,
      placeholder: 'Buscar una ubicación...',
      zoom: 15,
      mapboxgl: mapboxgl as any,
    });
    this.map.addControl(geocoder, 'top-left');
  }

  public enableDraw(isAdmin: boolean, onDrawUpdate: (coords: number[][]) => void): void {
    if (!isAdmin) return;
    
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });
    
    const { map, draw } = this;
    map.addControl(draw);
    
    const handleDraw = () => {
      if (!draw) return;
      
      const data = draw.getAll();
      if (data.features.length === 0) {
        onDrawUpdate([]);
        return;
      }
      
      const polygon = data.features[0];
      if (polygon.geometry.type !== 'Polygon') return;
      
      const coords = polygon.geometry.coordinates[0] ?? [];
      if (coords.length < 3) {
        if (polygon.id) {
          draw.delete(polygon.id as string);
        }
        onDrawUpdate([]);
        return;
      }
      
      onDrawUpdate(coords as number[][]);
    };
    
    map.on('draw.create', handleDraw);
    map.on('draw.update', handleDraw);
    map.on('draw.delete', handleDraw);
  }

  public clearDraw(): void {
    this.draw?.deleteAll();
  }

  public enableSingleClick(callback: (lngLat: { lng: number; lat: number }) => void): void {
    this.disableSingleClick();
    this.singleClickListener = (e) => callback(e.lngLat);
    this.map.on('click', this.singleClickListener);
  }

  public disableSingleClick(): void {
    if (this.singleClickListener) {
      this.map.off('click', this.singleClickListener);
      this.singleClickListener = undefined;
    }
  }

  public isStyleLoaded(): boolean {
    return this.map.isStyleLoaded();
  }

  public onceStyleLoad(callback: () => void): void {
    this.map.once('style.load', callback);
  }

  public removeLayersAndSources(prefix: string): void {
    if (!this.map || !this.map.isStyleLoaded()) return;

    const style = this.map.getStyle();
    if (!style?.layers) return;

    for (const layer of style.layers) {
      if (layer.id.startsWith(prefix)) {
        if (this.map.getLayer(layer.id)) {
          this.map.removeLayer(layer.id);
        }
        if (this.map.getSource(layer.id)) {
          this.map.removeSource(layer.id);
        }
      }
    }
  }

  public addZoneToMap(sourceId: string, layerId: string, coordinates: [number, number][], color: string): void {
    const { map } = this;
    
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
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

    map.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': color,
        'fill-opacity': 0.5
      },
    });
  }

  public updateZoneVisibility(layerId: string, visible: boolean): void {
    if (this.map.getLayer(layerId)) {
      this.map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  }

  private createCustomMarkerElement(elementType: ElementType): HTMLElement {
    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);

    const iconName = elementType.icon?.trim()
      ? elementType.icon.includes(':') ? elementType.icon : `mdi:${elementType.icon}`
      : 'mdi:map-marker';

    const bgColor = elementType.color
      ? elementType.color.startsWith('#') ? elementType.color : `#${elementType.color}`
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
          onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1.1)';
            target.style.boxShadow = '0 5px 10px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.22)';
          },
          onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1)';
            target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.22)';
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
  ): void {
    this.removeElementMarkers();
    const pointMap = new Map(points.map(p => [p.id, p]));
    const elementTypeMap = new Map(elementTypes.map(et => [et.id, et]));

    elements.forEach((element) => {
      if (!element.id || !element.point_id || !element.element_type_id) return;
      
      const point = pointMap.get(element.point_id);
      if (!point?.latitude || !point?.longitude) return;

      const elementType = elementTypeMap.get(element.element_type_id);
      if (!elementType) return;

      const markerElement = this.createCustomMarkerElement(elementType);
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat([point.longitude, point.latitude])
        .addTo(this.map);

      if (onElementClick) {
        marker.getElement().addEventListener('click', () => onElementClick(element));
      }

      this.elementMarkers.push({ marker, elementId: element.id });
    });
  }

  public removeElementMarker(elementId: number): void {
    const markerIndex = this.elementMarkers.findIndex((m) => m.elementId === elementId);
    if (markerIndex >= 0) {
      this.elementMarkers[markerIndex].marker.remove();
      this.elementMarkers.splice(markerIndex, 1);
    }
  }

  public removeElementMarkers(): void {
    this.elementMarkers.forEach((markerObj) => markerObj.marker.remove());
    this.elementMarkers = [];
  }

  public getCoordElement(element: Element, points: Point[]): { lat: number; lng: number } | null {
    const point = points.find((p) => p.id === element.point_id);
    if (!point?.latitude || !point?.longitude) return null;
    
    return { lat: point.latitude, lng: point.longitude };
  }

  public flyTo(coord: [number, number], zoom = 16): void {
    this.map.flyTo({ center: coord, zoom, essential: true });
  }

  public resizeMap(): void {
    this.map?.resize();
  }

  public updateMarkerVisibility(elementId: number, visible: boolean): void {
    const markerObj = this.elementMarkers.find((m) => m.elementId === elementId);
    if (markerObj) {
      markerObj.marker.getElement().style.display = visible ? '' : 'none';
    }
  }
}
