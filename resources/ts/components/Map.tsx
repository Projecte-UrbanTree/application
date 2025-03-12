import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { fetchZones } from '@/api/service/zoneService';
import { fetchPoints } from '@/api/service/pointService';
import { Zone } from '@/types/zone';
import { Point } from '@/types/point';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Roles } from '@/types/role';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [zones, setZones] = useState<Zone[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [coordinates, setCoordinates] = useState<number[][]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [enabledButton, setEnabledButton] = useState(false);

    const userValue = useSelector((state: RootState) => state.user);
    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/standard-satellite',
            center: [-3.70379, 40.41678],
            zoom: 12,
        });

        mapRef.current.addControl(
            new mapboxgl.NavigationControl(),
            'top-right',
        );
        mapRef.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        if (userValue.role === Roles.admin) {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: { polygon: true, trash: true },
            });
            mapRef.current.addControl(drawRef.current);
            mapRef.current.on('draw.create', updateArea);
            mapRef.current.on('draw.delete', updateArea);
            mapRef.current.on('draw.update', updateArea);
        }

        return () => mapRef.current?.remove();
    }, []);

    useEffect(() => {
        if (!mapRef.current || !currentContract) return;

        setZones([]);

        fetchZones().then((zonesData: Zone[]) => {
            setZones(zonesData);
            fetchPoints().then((allPoints: Point[]) => {
                zonesData.forEach((zone) => {
                    const zonePoints = allPoints
                        .filter((point) => point.zone_id === zone.id)
                        .map(
                            (point) =>
                                [
                                    point.longitude as number,
                                    point.latitude as number,
                                ] as [number, number],
                        );

                    if (zonePoints.length > 2) {
                        zonePoints.push(zonePoints[0]);
                        addZoneToMap(zone, zonePoints);
                    }
                });
            });
        });
    }, [currentContract]);

    function addZoneToMap(zone: Zone, zonePoints: [number, number][]) {
        if (!mapRef.current) return;
        const geoJsonZone: GeoJSON.Feature = {
            type: 'Feature',
            properties: { id: zone.id, name: zone.name, color: zone.color },
            geometry: { type: 'Polygon', coordinates: [zonePoints] },
        };

        if (mapRef.current.getSource(`zone-${zone.id}`)) {
            mapRef.current.removeSource(`zone-${zone.id}`);
            mapRef.current.removeLayer(`zone-layer-${zone.id}`);
            mapRef.current.removeLayer(`zone-border-${zone.id}`);
        }

        mapRef.current.addSource(`zone-${zone.id}`, {
            type: 'geojson',
            data: geoJsonZone,
        });
        mapRef.current.addLayer({
            id: `zone-layer-${zone.id}`,
            type: 'fill',
            source: `zone-${zone.id}`,
            paint: {
                'fill-color': zone.color || '#ff0000',
                'fill-opacity': 0.5,
            },
        });
        mapRef.current.addLayer({
            id: `zone-border-${zone.id}`,
            type: 'line',
            source: `zone-${zone.id}`,
            paint: { 'line-color': '#000000', 'line-width': 2 },
        });
    }

    function updateArea() {
        if (!drawRef.current) return;
        const data = drawRef.current.getAll();
        if (data.features.length > 0) {
            const polygon = data.features[0];

            setCoordinates(
                polygon.geometry.type === 'Polygon'
                    ? polygon.geometry.coordinates[0]
                    : [],
            );

            console.log(polygon.geometry);

            setIsDrawingMode(true);
            setEnabledButton(true);
        } else {
            setIsDrawingMode(false);
            setEnabledButton(false);
        }
    }

    async function handleZoneSaved() {
        setModalVisible(false);
        setIsDrawingMode(false);
        setEnabledButton(false);

        fetchZones().then((zonesData: Zone[]) => {
            setZones(zonesData);
            fetchPoints().then((allPoints: Point[]) => {
                zonesData.forEach((zone) => {
                    const zonePoints = allPoints
                        .filter((point) => point.zone_id === zone.id)
                        .map(
                            (point) =>
                                [
                                    point.longitude as number,
                                    point.latitude as number,
                                ] as [number, number],
                        );

                    if (zonePoints.length > 2) {
                        zonePoints.push(zonePoints[0]);
                        addZoneToMap(zone, zonePoints);
                    }
                });
            });
        });

        if (drawRef.current) {
            drawRef.current.deleteAll();
        }
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '90%' }}>
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%' }}
            />

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
                <SaveZoneForm
                    coordinates={coordinates}
                    onClose={handleZoneSaved}
                />
            </Dialog>
        </div>
    );
};

export default MapComponent;
