import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
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

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [zones, setZones] = useState<Zone[]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const userValue = useSelector((state: RootState) => state.user);
    const [coordinates, setCoordinates] = useState<number[][]>([[]]);

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
        mapRef.current.addControl(
            new mapboxgl.FullscreenControl(),
            'top-right',
        );
        mapRef.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
            }),
            'top-right',
        );

        if (userValue.role === Roles.admin) {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                },
            });
            mapRef.current.addControl(drawRef.current);
            mapRef.current.on('draw.create', updateArea);
            mapRef.current.on('draw.delete', updateArea);
            mapRef.current.on('draw.update', updateArea);
        }

        return () => mapRef.current?.remove();
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

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
    }, [mapRef]);

    function addZoneToMap(zone: Zone, zonePoints: [number, number][]) {
        const geoJsonZone: GeoJSON.Feature = {
            type: 'Feature',
            properties: {
                id: zone.id,
                name: zone.name,
                description: zone.description,
                color: zone.color,
            },
            geometry: { type: 'Polygon', coordinates: [zonePoints] },
        };

        mapRef.current!.addSource(`zone-${zone.id}`, {
            type: 'geojson',
            data: geoJsonZone,
        });
        mapRef.current!.addLayer({
            id: `zone-layer-${zone.id}`,
            type: 'fill',
            source: `zone-${zone.id}`,
            paint: {
                'fill-color': zone.color || '#ff0000',
                'fill-opacity': 0.5,
            },
        });
        mapRef.current!.addLayer({
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
            const coordinates =
                polygon.geometry.type === 'Polygon'
                    ? polygon.geometry.coordinates[0]
                    : [];

            console.log(coordinates);

            setCoordinates(coordinates);
            setIsDrawingMode(true);
        } else {
            setIsDrawingMode(false);
        }
    }

    function openSaveModal() {
        setModalVisible(true);
    }

    function saveZonesToDatabase() {
        console.log(
            'Enviando zonas a la base de datos:',
            JSON.stringify(zones, null, 2),
        );
        setModalVisible(false);
        alert('Zonas guardadas correctamente');
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%' }}
            />

            {userValue.role === Roles.admin && isDrawingMode && (
                <Button
                    label="Guardar Zona"
                    onClick={openSaveModal}
                    className="absolute bottom-16 left-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-10"
                />
            )}

            <Dialog
                header="Guardar Zona"
                visible={modalVisible}
                onHide={() => setModalVisible(false)}>
                <p>¿Deseas guardar la zona seleccionada?</p>
                <div className="flex gap-2 mt-4">
                    <Button
                        label="Cancelar"
                        onClick={() => setModalVisible(false)}
                        className="p-button-secondary"
                    />
                    <Button
                        label="Guardar"
                        onClick={saveZonesToDatabase}
                        className="p-button-success"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default MapComponent;
