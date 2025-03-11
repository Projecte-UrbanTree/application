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
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { latitude, longitude } = useGeolocation();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [area, setArea] = useState<number | null>(null);
    const [zones, setZones] = useState<any[]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
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
            setIsDrawingMode(true);
        } else {
            setArea(null);
            setZones([]);
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
