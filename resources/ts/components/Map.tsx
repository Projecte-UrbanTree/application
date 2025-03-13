import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Roles } from '@/types/role';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { SaveZoneForm } from './Admin/Inventory/SaveZoneForm';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Zone } from '@/types/zone';
import { fetchPoints } from '@/api/service/pointService';
import { Point } from '@/types/point';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
interface MapProps {
    selectedZone: Zone | null;
}

const MapComponent: React.FC<MapProps> = ({ selectedZone }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [coordinates, setCoordinates] = useState<number[][]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [enabledButton, setEnabledButton] = useState(false);
    const userValue = useSelector((state: RootState) => state.user);

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

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken!,
            marker: true,
            placeholder: 'Buscar una ubicación...',
            zoom: 15,
        });

        mapRef.current.addControl(geocoder, 'top-left');

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
        const fetchData = async () => {
            try {
                const allPoints: Point[] = await fetchPoints();
                if (selectedZone && mapRef.current) {
                    const firstPoint: Point = allPoints.filter(
                        (p: Point) => p.zone_id === selectedZone.id,
                    )[0];

                    const coordinate: number[] = [
                        firstPoint.longitude!,
                        firstPoint.latitude!,
                    ];

                    mapRef.current.flyTo({
                        center: [coordinate[0], coordinate[1]],
                        zoom: 18,
                        essential: true,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [selectedZone]);

    function updateArea() {
        if (!drawRef.current) return;
        const data = drawRef.current.getAll();
        if (data.features.length > 0) {
            const polygon = data?.features?.[0];

            if (
                polygon?.geometry?.type === 'Polygon' &&
                Array.isArray(polygon.geometry.coordinates)
            ) {
                setCoordinates(polygon.geometry.coordinates[0] ?? []);
            } else {
                console.error(
                    'El objeto Polygon no tiene la estructura esperada',
                    polygon,
                );
            }

            setIsDrawingMode(true);
            setEnabledButton(true);
        } else {
            setIsDrawingMode(false);
            setEnabledButton(false);
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
                    onClose={async () => setModalVisible(false)}
                />
            </Dialog>
        </div>
    );
};

export default MapComponent;
