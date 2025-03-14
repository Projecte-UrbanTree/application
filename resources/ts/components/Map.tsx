import { MapService } from '@/api/service/mapService';
import { RootState, AppDispatch } from '@/store/store';
import { fetchPointsAsync } from '@/store/slice/pointSlice';
import { Point } from '@/types/Point';
import { Roles } from '@/types/Role';
import { Zone } from '@/types/Zone';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  selectedZone: Zone | null;
}

export const MapComponent: React.FC<MapProps> = ({ selectedZone }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapServiceRef = useRef<MapService | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const userValue = useSelector((state: RootState) => state.user);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const zonesRedux = useSelector((state: RootState) => state.zone.zones);
  const { points, loading, error } = useSelector(
    (state: RootState) => state.points,
  );

  useEffect(() => {
    if (!currentContract) return;
    dispatch(fetchPointsAsync());
  }, [currentContract, dispatch]);

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

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone || !points.length) return;

    const firstPoint = points.find((p) => p.zone_id === selectedZone.id);
    if (firstPoint?.longitude && firstPoint?.latitude) {
      service.flyTo([firstPoint.longitude, firstPoint.latitude]);
    }
  }, [selectedZone, points]);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !zonesRedux.length || !points.length) return;

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

  async function handleZoneSaved() {
    setModalVisible(false);
    setIsDrawingMode(false);
    setEnabledButton(false);
    const service = mapServiceRef.current;
    service?.clearDraw();
    dispatch(fetchPointsAsync());
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
    </div>
  );
};
