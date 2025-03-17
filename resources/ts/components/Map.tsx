import { MapService } from '@/api/service/mapService';
import { RootState, AppDispatch } from '@/store/store';
import { fetchPointsAsync, savePointsAsync } from '@/store/slice/pointSlice';
import { Point, TypePoint } from '@/types/Point';
import { Roles } from '@/types/Role';
import { Zone } from '@/types/Zone';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';
import { SaveElementForm } from './Admin/Inventory/SaveElementForm';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TreeTypes } from '@/types/TreeTypes';
import { fetchTreeTypes } from '@/api/service/treeTypesService';
import { fetchElementType } from '@/api/service/elementTypeService';
import { ElementType } from '@/types/ElementType';
import { SavePointsProps } from '@/api/service/pointService';
import { eventSubject, ZoneEvent } from './Admin/Inventory/Zones';
import { data } from 'react-router-dom';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  selectedZone: Zone | null;
  zoneToAddElement: Zone | null;
  onElementAdd: () => void;
}

export const MapComponent: React.FC<MapProps> = ({
  selectedZone,
  // zoneToAddElement,
  onElementAdd,
}) => {
  // refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapServiceRef = useRef<MapService | null>(null);

  // states
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [newPointCoord, setNewPointCoord] = useState<[number, number] | null>(
    null,
  );
  const [modalAddPointVisible, setModalAddPointVisible] = useState(false);
  const [treeTypes, setTreeTypes] = useState<TreeTypes[]>([]);
  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);

  const [zoneToAddElement, setSelectedZoneToAdd] = useState<Zone>();

  // redux store
  const dispatch = useDispatch<AppDispatch>();
  const userValue = useSelector((state: RootState) => state.user);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const zonesRedux = useSelector((state: RootState) => state.zone.zones);
  const { points } = useSelector((state: RootState) => state.points);
  const { elements } = useSelector((state: RootState) => state.element);

  // load data
  useEffect(() => {
    const loadData = async () => {
      const treeTypesFetch = await fetchTreeTypes();
      const elementTypeFetch = await fetchElementType();

      setTreeTypes(treeTypesFetch);
      setElementTypes(elementTypeFetch);
    };
    loadData();
  }, []);

  // incialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const service = new MapService(mapContainerRef.current, MAPBOX_TOKEN!);
    service.addBasicControls();
    service.addGeocoder();
    service.enableDraw(userValue.role === Roles.admin, (coords) => {
      if (coords.length > 0) {
        setCoordinates(coords);
        setIsDrawingMode(true);
        setEnabledButton(true);
      } else {
        setIsDrawingMode(false);
        setEnabledButton(false);
      }
    });
    mapServiceRef.current = service;
  }, [userValue.role]);

  // load points if contract is active
  useEffect(() => {
    if (!currentContract) return;
    dispatch(fetchPointsAsync());
  }, [currentContract, dispatch]);

  // fly to a selected zone
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone || !points.length) return;
    const firstPoint = points.find((p) => p.zone_id === selectedZone.id);
    if (firstPoint?.longitude && firstPoint?.latitude) {
      service.flyTo([firstPoint.longitude, firstPoint.latitude]);
    }
  }, [selectedZone, points]);

  // if "zoneToAddElement" change, enter on mode "add point"
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;

    const subscription = eventSubject.subscribe({
      next: (data: ZoneEvent) => {
        const { isCreatingElement, zone } = data;
        setSelectedZoneToAdd(zone);

        if (!isCreatingElement) {
          setIsAddingPoint(false);
          service.disableSingleClick();
          return;
        }
        setIsAddingPoint(true);
        service.enableSingleClick((lngLat) => {
          setNewPointCoord([lngLat.lng, lngLat.lat]);
          setModalAddPointVisible(true);
        });
        const firstPoint = points.find((p: Point) => p.zone_id === zone?.id);
        if (firstPoint?.longitude && firstPoint?.latitude) {
          service.flyTo([firstPoint.longitude, firstPoint.latitude]);
        }
      },
      error: (err: Error) => console.log('ERROR STREAM: ', err.message),
      complete: () => console.log('STREAM COMPLETADO'),
    });

    return () => subscription.unsubscribe();
  }, [zoneToAddElement]);

  // draw zones
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;
    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => updateZones(service));
    } else {
      updateZones(service);
    }
  }, [zonesRedux, points, currentContract]);

  function updateZones(service: MapService) {
    service.removeLayersAndSources('zone-');
    const filteredZones = zonesRedux.filter(
      (z) => z.contract_id === currentContract?.id,
    );
    filteredZones.forEach((zone) => {
      const zonePoints = points
        .filter((p) => p.zone_id === zone.id)
        .map((p) => [p.longitude!, p.latitude!] as [number, number]);
      if (zonePoints.length > 2) {
        zonePoints.push(zonePoints[0]);
        service.addZoneToMap(`zone-${zone.id}`, zonePoints);
      }
    });
  }

  // draw elements
  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service) return;
    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => updateElements(service));
    } else {
      updateElements(service);
    }
  }, [elements, currentContract]);

  function updateElements(service: MapService) {
    service.addElementMarkers(elements, points);
  }

  // save drawed zone
  async function handleZoneSaved(newZone: Zone, newPoints: SavePointsProps[]) {
    setModalVisible(false);
    setIsDrawingMode(false);
    setEnabledButton(false);

    const service = mapServiceRef.current;
    if (!service) return;

    service.clearDraw();

    const zonePoints = newPoints.map(
      (p) => [p.longitude, p.latitude] as [number, number],
    );

    if (zonePoints.length > 2) {
      zonePoints.push(zonePoints[0]);
      service.addZoneToMap(`zone-${newZone.id}`, zonePoints);
    }
  }

  async function handleSavePoint() {
    if (!newPointCoord || !zoneToAddElement) return;
    await dispatch(
      savePointsAsync([
        {
          latitude: newPointCoord[1],
          longitude: newPointCoord[0],
          type: TypePoint.element,
          zone_id: zoneToAddElement.id!,
        },
      ]),
    ).unwrap();
    dispatch(fetchPointsAsync());
    setModalAddPointVisible(false);
    setIsAddingPoint(false);
    setNewPointCoord(null);
    mapServiceRef.current?.disableSingleClick();
    onElementAdd();
  }

  function detectCollision(
    allPoints: Point[],
    contractId: number,
    zones: Zone[],
    newPolygonCoords: number[][],
  ): boolean {
    if (contractId === 0) return false;
    const filteredZones = zones.filter((z) => z.contract_id === contractId);
    const createdPoly = turf.polygon([newPolygonCoords]);
    for (let i = 0; i < filteredZones.length; i++) {
      const existingPoly = getZonePolygon(filteredZones[i], allPoints);
      const polyIntersection = turf.intersect(createdPoly, existingPoly);
      if (polyIntersection) {
        return true;
      }
    }
    return false;
  }

  function getZonePolygon(zone: Zone, allPoints: Point[]) {
    const zonePoints = allPoints.filter((p) => p.zone_id === zone.id);
    const coords: number[][] = [];
    for (let i = 0; i < zonePoints.length; i++) {
      coords.push([zonePoints[i].longitude!, zonePoints[i].latitude!]);
    }
    return turf.polygon([coords]);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '90%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {userValue.role === Roles.admin && isDrawingMode && (
        <Button
          label="Guardar Zona"
          onClick={() => setModalVisible(true)}
          className="absolute bottom-16 left-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-10"
          disabled={!enabledButton}
        />
      )}
      <Dialog
        header="Guardar Zona"
        visible={modalVisible}
        onHide={() => setModalVisible(false)}>
        <SaveZoneForm coordinates={coordinates} onClose={handleZoneSaved} />
      </Dialog>
      <Dialog
        header="Guardar Elemento"
        visible={modalAddPointVisible}
        onHide={() => setModalAddPointVisible(false)}>
        <SaveElementForm
          zoneId={zoneToAddElement?.id!}
          coordinate={newPointCoord!}
          onClose={() => {
            setModalAddPointVisible(false);
            setIsAddingPoint(false);
            setNewPointCoord(null);
            mapServiceRef.current?.disableSingleClick();
            onElementAdd();
          }}
          elementTypes={elementTypes.map((item) => ({
            label: `${item.name}`,
            value: item.id!,
          }))}
          treeTypes={treeTypes.map((item) => ({
            label: `${item.family} ${item.genus} ${item.species}`,
            value: item.id!,
          }))}
        />
      </Dialog>
    </div>
  );
};
