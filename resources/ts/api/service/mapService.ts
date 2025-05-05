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
  private elementMarkers: Map<
    number,
    { marker: mapboxgl.Marker; elementId: number }
  > = new Map();
  private zoneCoords: ZoneCenterCoord[];
  private geoCoords: number[];
  private isMapInitialized: boolean = false;
  private initCallbacks: Array<() => void> = [];
  private drawControlAdded: boolean = false;

  constructor(
    container: HTMLDivElement,
    token: string,
    zoneCoords: ZoneCenterCoord[],
    geoCoords: number[],
  ) {
    if (!token) {
      console.error('MapService: MapBox token is required');
      throw new Error('MapBox token is required');
    }

    this.zoneCoords = zoneCoords || [];
    this.geoCoords = geoCoords || DEFAULT_CENTER;
    
    try {
      mapboxgl.accessToken = token;
      
      this.map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: this.getCenter(),
        zoom: 16,
        minZoom: 2,
        maxZoom: 18
      });

      this.map.on('load', () => {
        console.log('Map loaded successfully');
        this.isMapInitialized = true;
        this.initCallbacks.forEach((callback) => callback());
        this.initCallbacks = [];
        
        // Force resize after load to ensure correct dimensions
        setTimeout(() => {
          console.log('Resizing map service');
          this.map.resize();
        }, 100);
      });
      
      this.map.on('error', (e) => {
        console.error('Map error:', e);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  }

  private getCenter(): LngLatLike {
    if (
      this.zoneCoords?.length > 0 &&
      this.zoneCoords[0].center?.length === 2
    ) {
      return this.zoneCoords[0].center as [number, number];
    }
    if (this.geoCoords?.length === 2) {
      return this.geoCoords as [number, number];
    }
    return DEFAULT_CENTER;
  }

public addBasicControls(): void {
  const controls = [
    { 
      control: new mapboxgl.NavigationControl(), 
      position: 'top-right' as ControlPosition,
      className: 'map-control-navigation'
    },
    { 
      control: new mapboxgl.ScaleControl(), 
      position: 'bottom-left' as ControlPosition,
      className: 'map-control-scale'
    },
    { 
      control: new mapboxgl.FullscreenControl(), 
      position: 'top-right' as ControlPosition,
      className: 'map-control-fullscreen'
    },
    {
      control: new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      position: 'top-right' as ControlPosition,
      className: 'map-control-geolocate'
    },
  ];

  controls.forEach(({ control, position, className }) => {
    this.map.addControl(control, position);
    if (className) {
      setTimeout(() => {
        const controlContainer = document.querySelector(
          `.mapboxgl-ctrl-${className.split('-').pop()}`
        );
        if (controlContainer) {
          controlContainer.classList.add(className);
        }
      }, 100);
    }
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

  public removeDraw(): void {
    if (!this.draw || !this.drawControlAdded) return;

    try {
      this.map.removeControl(this.draw);
      this.drawControlAdded = false;
      this.draw = undefined;

      const drawSources = [
        'mapbox-gl-draw-cold',
        'mapbox-gl-draw-hot',
        'mapbox-gl-draw-warm',
      ];

      drawSources.forEach((source) => {
        if (this.map.getSource(source)) {
          try {
            const layers = this.map.getStyle().layers || [];
            layers.forEach((layer) => {
              if (layer.source === source && this.map.getLayer(layer.id)) {
                this.map.removeLayer(layer.id);
              }
            });
            this.map.removeSource(source);
          } catch (e) {}
        }
      });
    } catch (e) {}
  }

  public enableDraw(
    isAdmin: boolean,
    onDrawUpdate: (coords: number[][]) => void,
  ): void {
    if (!isAdmin) return;

    this.removeDraw();

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });

    this.map.addControl(this.draw);
    this.drawControlAdded = true;

    const handleDraw = () => {
      if (!this.draw) return;

      const data = this.draw.getAll();
      if (data.features.length === 0) {
        onDrawUpdate([]);
        return;
      }

      const polygon = data.features[0];
      if (!polygon || polygon.geometry.type !== 'Polygon') return;

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
    events.forEach((event) => this.map.on(event, handleDraw));
  }

  public clearDraw(): void {
    if (this.draw) {
      try {
        this.draw.deleteAll();
      } catch (e) {}
    }
  }

  public enableSingleClick(
    callback: (lngLat: { lng: number; lat: number }) => void,
  ): void {
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
    if (this.map.isStyleLoaded()) {
      callback();
    } else {
      this.map.once('style.load', callback);
    }
  }

  public removeLayersAndSources(prefix: string): void {
    if (!this.map?.isStyleLoaded()) return;

    try {
      const style = this.map.getStyle();
      if (!style?.layers) return;

      const layersToRemove = style.layers
        .filter((layer) => layer.id.startsWith(prefix))
        .map((layer) => layer.id);

      layersToRemove.forEach((id) => {
        if (this.map.getLayer(id)) {
          try {
            this.map.removeLayer(id);
          } catch (e) {}
        }
      });

      layersToRemove.forEach((id) => {
        if (this.map.getSource(id)) {
          try {
            this.map.removeSource(id);
          } catch (e) {}
        }
      });
    } catch (e) {}
  }

  public addZoneToMap(
    sourceId: string,
    layerId: string,
    coordinates: [number, number][],
    color: string,
  ): void {
    try {
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
          'fill-opacity': 0.5,
        },
      });
    } catch (e) {}
  }

  public updateZoneVisibility(layerId: string, visible: boolean): void {
    if (this.map.getLayer(layerId)) {
      this.map.setLayoutProperty(
        layerId,
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
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
            target.style.boxShadow =
              '0 5px 10px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.22)';
          },
          onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            target.style.transform = 'scale(1)';
            target.style.boxShadow =
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
  ): void {
    this.removeElementMarkers();

    const pointMap = new Map(points.map((p) => [p.id, p]));
    const elementTypeMap = new Map(elementTypes.map((et) => [et.id, et]));

    elements.forEach((element) => {
      if (!element.id || !element.point_id || !element.element_type_id) return;

      const point = pointMap.get(element.point_id);
      if (!point?.latitude || !point?.longitude) return;

      const elementType = elementTypeMap.get(element.element_type_id);
      if (!elementType) return;

      try {
        const markerElement = this.createCustomMarkerElement(elementType);
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center',
        })
          .setLngLat([point.longitude, point.latitude])
          .addTo(this.map);

        if (onElementClick) {
          marker
            .getElement()
            .addEventListener('click', () => onElementClick(element));
        }

        this.elementMarkers.set(element.id, { marker, elementId: element.id });
      } catch (e) {}
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

  public getCoordElement(
    element: Element,
    points: Point[],
  ): { lat: number; lng: number } | null {
    const point = points.find((p) => p.id === element.point_id);
    if (!point?.latitude || !point?.longitude) return null;
    return { lat: point.latitude, lng: point.longitude };
  }

  public async flyTo(selectedZone: Zone) {
    if (selectedZone.id === null) return;

    try {
      const zoneData = await getZoneZoom(selectedZone.id!);
      
      if (zoneData && zoneData.center) {
        const { zoom, center } = zoneData;
        this.map.flyTo({
          center: [center[0], center[1]],
          zoom,
          essential: true,
        });
      }
    } catch (e) {
      console.error('Error flying to zone:', e);
    }
  }

  public onMapLoad(callback: () => void): () => void {
    this.map.on('load', callback);
    return () => this.map.off('load', callback);
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
    this.removeDraw();

    try {
      const style = this.map.getStyle();
      if (!style?.layers) return;

      const baseLayers = ['background', 'satellite'];
      const layers = style.layers
        .filter((layer) => !baseLayers.includes(layer.id))
        .map((layer) => layer.id);

      layers.forEach((id) => {
        if (this.map.getLayer(id)) {
          try {
            this.map.removeLayer(id);
          } catch (e) {}
        }
      });

      const sources = Object.keys(style.sources || {}).filter(
        (id) => !id.startsWith('mapbox'),
      );

      sources.forEach((id) => {
        if (this.map.getSource(id)) {
          try {
            this.map.removeSource(id);
          } catch (e) {}
        }
      });
    } catch (e) {}
  }
}
