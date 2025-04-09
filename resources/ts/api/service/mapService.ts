import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { Icon } from '@iconify/react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl, { ControlPosition, IControl, LngLatLike } from 'mapbox-gl';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Element } from '@/types/Element';
import { ElementType } from '@/types/ElementType';
import { Point } from '@/types/Point';
import { TreeTypes } from '@/types/TreeTypes';
import { Zone, ZoneCenterCoord } from '@/types/Zone';
import { getZoneZoom } from './zoneService';

const DEFAULT_CENTER: [number, number] = [-3.70379, 40.41678];

export class MapService {
  private map!: mapboxgl.Map;
  private draw?: MapboxDraw;
  private singleClickListener?: (e: mapboxgl.MapMouseEvent) => void;
  private elementMarkers: Map<number, { marker: mapboxgl.Marker; elementId: number }> = new Map();
  private zoneCoords: ZoneCenterCoord[];
  private geoCoords: number[];
  private isMapInitialized: boolean = false;
  private initCallbacks: Array<() => void> = [];

  constructor(container: HTMLDivElement, token: string, zoneCoords: ZoneCenterCoord[], geoCoords: number[]) {
    this.zoneCoords = zoneCoords;
    this.geoCoords = geoCoords;
    mapboxgl.accessToken = token;
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: this.getCenter(),
      zoom: 16,
    });

    this.map.on('load', () => {
      this.isMapInitialized = true;
      this.initCallbacks.forEach(callback => callback());
      this.initCallbacks = [];
    });
  }

  private getCenter(): LngLatLike {
    if (this.zoneCoords?.length > 0 && this.zoneCoords[0].center?.length === 2) {
      return this.zoneCoords[0].center as [number, number];
    }
    if (this.geoCoords?.length === 2) {
      return this.geoCoords as [number, number];
    }
    return DEFAULT_CENTER;
  }

  public addBasicControls(): void {
    const controls: { control: IControl; position: ControlPosition }[] = [
      { control: new mapboxgl.NavigationControl(), position: 'top-right' },
      { control: new mapboxgl.ScaleControl(), position: 'bottom-left' },
      { control: new mapboxgl.FullscreenControl(), position: 'top-right' },
      { 
        control: new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }), 
        position: 'top-right' 
      }
    ];

    controls.forEach(({ control, position }) => {
      this.map.addControl(control, position);
    });
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
    
    this.map.addControl(this.draw);
    
    const handleDraw = () => {
      if (!this.draw) return;
      
      const data = this.draw.getAll();
      if (data.features.length === 0) {
        onDrawUpdate([]);
        return;
      }
      
      const polygon = data.features[0];
      if (polygon.geometry.type !== 'Polygon') return;
      
      const coords = polygon.geometry.coordinates[0] ?? [];
      if (coords.length < 3) {
        if (polygon.id) {
          this.draw.delete(polygon.id as string);
        }
        onDrawUpdate([]);
        return;
      }
      
      onDrawUpdate(coords as number[][]);
    };
    
    const events = ['draw.create', 'draw.update', 'draw.delete'];
    events.forEach(event => this.map.on(event, handleDraw));
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
    if (!this.map?.isStyleLoaded()) return;

    const style = this.map.getStyle();
    if (!style?.layers) return;

    style.layers.forEach(layer => {
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

  public addZoneToMap(sourceId: string, layerId: string, coordinates: [number, number][], color: string): void {
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

    const markerStyle = {
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
    };

    root.render(
      React.createElement(
        'div',
        {
          className: 'element-marker',
          style: markerStyle,
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
    
    let markersAdded = 0;

    elements.forEach((element) => {
      if (!element.id || !element.point_id || !element.element_type_id) {
        return;
      }
      
      const point = pointMap.get(element.point_id);
      if (!point?.latitude || !point?.longitude) {
        return;
      }

      const elementType = elementTypeMap.get(element.element_type_id);
      if (!elementType) {
        return;
      }

      try {
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

        this.elementMarkers.set(element.id, { marker, elementId: element.id });
        markersAdded++;
      } catch (error) {
      }
    });
  }

  public removeElementMarker(elementId: number): void {
    const markerObj = this.elementMarkers.get(elementId);
    if (markerObj) {
      markerObj.marker.remove();
      this.elementMarkers.delete(elementId);
    }
  }

  public removeElementMarkers(): void {
    this.elementMarkers.forEach(({ marker }) => marker.remove());
    this.elementMarkers.clear();
  }

  public getCoordElement(element: Element, points: Point[]): { lat: number; lng: number } | null {
    const point = points.find((p) => p.id === element.point_id);
    if (!point?.latitude || !point?.longitude) return null;
    return { lat: point.latitude, lng: point.longitude };
  }

  public async flyTo(selectedZone: Zone) {
    if (selectedZone.id === null) return;
    const { zoom, center }: ZoneCenterCoord = await getZoneZoom(selectedZone.id!);
    
    if (center) {
      this.map.flyTo({ center: [center[0], center[1]], zoom, essential: true });
    }
  }

  public onMapLoad(callback: () => void): () => void {
    this.map.on('load', callback);
    
    return () => {
      this.map.off('load', callback);
    };
  }

  public resizeMap(): void {
    this.map?.resize();
  }

  public updateMarkerVisibility(elementId: number, visible: boolean): void {
    const markerObj = this.elementMarkers.get(elementId);
    if (markerObj) {
      markerObj.marker.getElement().style.display = visible ? '' : 'none';
    }
  }

  public isReady(): boolean {
    return this.isMapInitialized && this.map.isStyleLoaded();
  }

  public waitForInit(callback: () => void): void {
    if (this.isReady()) {
      callback();
    } else {
      this.initCallbacks.push(callback);
    }
  }

  public resetMap(): void {
    this.removeElementMarkers();
    this.clearDraw();
    try {
      const style = this.map.getStyle();
      if (style?.layers) {
        const baseLayers = ['background', 'satellite'];
        style.layers
          .filter(layer => !baseLayers.includes(layer.id))
          .forEach(layer => {
            if (this.map.getLayer(layer.id)) {
              this.map.removeLayer(layer.id);
            }
          });
      }
      
      if (style?.sources) {
        Object.keys(style.sources)
          .filter(sourceId => !sourceId.startsWith('mapbox'))
          .forEach(sourceId => {
            if (this.map.getSource(sourceId)) {
              this.map.removeSource(sourceId);
            }
          });
      }
    } catch (error) {
    }
  }
}
