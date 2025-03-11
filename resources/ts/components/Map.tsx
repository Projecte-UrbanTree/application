import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import useGeolocation from '@/hooks/useGeolocation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Roles } from '@/types/role';
import { Zones } from './Admin/Inventory/Zones';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { latitude, longitude } = useGeolocation();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [area, setArea] = useState<number | null>(null);
    const [zones, setZones] = useState<any[]>([]); // Guarda las zonas creadas
    const userValue = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!mapContainerRef.current || latitude === null || longitude === null)
            return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/standard-satellite',
                center: [longitude, latitude],
                zoom: 12,
            });

            mapRef.current.addControl(
                new mapboxgl.NavigationControl(),
                'top-right',
            );
            mapRef.current.addControl(
                new mapboxgl.ScaleControl(),
                'bottom-left',
            );
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
        }
    }, [latitude, longitude, userValue.role]);

    function updateArea() {
        if (!drawRef.current) return;
        const data = drawRef.current.getAll();

        console.log('Zona creada:', JSON.stringify(data, null, 2));

        if (data.features.length > 0) {
            const calculatedArea = turf.area(data);
            setArea(Math.round(calculatedArea * 100) / 100);
            setZones(data.features);
        } else {
            setArea(null);
            setZones([]);
        }
    }

    function saveZonesToDatabase() {
        if (zones.length === 0) {
            alert('No hay zonas para guardar.');
            return;
        }

        console.log(
            'Enviando zonas a la base de datos:',
            JSON.stringify(zones, null, 2),
        );
        alert('Zonas guardadas correctamente');
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%' }}
            />

            {userValue.role === Roles.admin && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        left: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: 10,
                        textAlign: 'center',
                    }}>
                    <p>Área seleccionada:</p>
                    {area !== null ? (
                        <p>
                            <strong>{area}</strong> m²
                        </p>
                    ) : (
                        <p>Selecciona un área</p>
                    )}
                    <button
                        onClick={saveZonesToDatabase}
                        style={{
                            marginTop: 10,
                            padding: '8px 12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}>
                        Guardar Zona
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
