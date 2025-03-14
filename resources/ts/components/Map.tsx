import { MapService } from '@/api/service/mapService';
import { fetchPoints } from '@/api/service/pointService';
import { fetchZones } from '@/api/service/zoneService';
import { RootState } from '@/store/store';
import { Point } from '@/types/Point';
import { Roles } from '@/types/Role';
import { Zone } from '@/types/Zone';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  selectedZone: Zone | null;
}

export const MapComponent: React.FC<MapProps> = ({ selectedZone }) => {
  // Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapServiceRef = useRef<MapService | null>(null);

  // states
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [enabledButton, setEnabledButton] = useState(false);

  // redux
  const userValue = useSelector((state: RootState) => state.user);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  // api data
  const [zones, setZones] = useState<Zone[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const zonesData = await fetchZones();
        setZones(zonesData);

        const pointsData = await fetchPoints();
        setPoints(pointsData);
      } catch (error) {
        console.error('Error al cargar zonas y puntos:', error);
      }
    }
    if (currentContract) {
      loadData();
    }
  }, [currentContract]);

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
  }, []);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !selectedZone) return;

    async function flyToSelectedZone() {
      const allPoints = await fetchPoints();
      const firstPoint = allPoints.find((p) => p.zone_id === selectedZone!.id);
      if (firstPoint?.longitude && firstPoint?.latitude) {
        service!.flyTo([firstPoint.longitude, firstPoint.latitude]);
      }
    }

    flyToSelectedZone();
  }, [selectedZone]);

  useEffect(() => {
    const service = mapServiceRef.current;
    if (!service || !zones.length || !points.length) return;

    if (!service.isStyleLoaded()) {
      service.onceStyleLoad(() => updateZones(service));
    } else {
      updateZones(service);
    }
  }, [zones, points, currentContract]);

  function updateZones(service: MapService) {
    service.removeLayersAndSources('zone-');

    const filteredZones = zones.filter(
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
