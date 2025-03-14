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
import { fetchZones } from '@/api/service/zoneService';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
interface MapProps {
    selectedZone: Zone | null;
}

export const MapComponent: React.FC<MapProps> = ({ selectedZone }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [coordinates, setCoordinates] = useState<number[][]>([]);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [enabledButton, setEnabledButton] = useState(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const userValue = useSelector((state: RootState) => state.user);
    const currentContract = useSelector(
        (state: RootState) => state.contract.currentContract,
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                const zonesData = await fetchZones();
                setZones(zonesData);

                const pointsData = await fetchPoints();
                setPoints(pointsData);
            } catch (error) {
                console.error('Error al cargar zonas y puntos:', error);
            }
        };

        loadData();
    }, [currentContract]);

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

    useEffect(() => {
        if (!mapRef.current || !zones.length || !points.length) return;

        if (!mapRef.current.isStyleLoaded()) {
            mapRef.current.once('style.load', () => {
                actualizarZonasEnMapa();
            });
        } else {
            actualizarZonasEnMapa();
        }
    }, [zones, points, currentContract]);

    function actualizarZonasEnMapa() {
        if (!mapRef.current) return;

        const style = mapRef.current.getStyle();
        if (style?.layers) {
            style.layers.forEach((layer) => {
                if (layer.id.startsWith('zone-')) {
                    if (mapRef.current?.getLayer(layer.id)) {
                        mapRef.current.removeLayer(layer.id);
                    }
                    if (mapRef.current?.getSource(layer.id)) {
                        mapRef.current.removeSource(layer.id);
                    }
                }
            });
        }

        const filteredZones = zones.filter(
            (zone) => zone.contract_id === currentContract?.id,
        );

        filteredZones.forEach((zone) => {
            const zonePoints = points
                .filter((p) => p.zone_id === zone.id)
                .map(
                    (p) =>
                        [p.longitude as number, p.latitude as number] as [
                            number,
                            number,
                        ],
                );

            if (zonePoints.length > 2) {
                zonePoints.push(zonePoints[0]);
                addZoneToMap(zone, zonePoints);
            }
        });
    }

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

    function addZoneToMap(zone: Zone, zonePoints: [number, number][]) {
        if (!mapRef.current) return;

        const sourceId = `zone-${zone.id}`;
        const fillLayerId = `zone-${zone.id}`;
        const outlineLayerId = `zone-${zone.id}-outline`;

        if (mapRef.current.getSource(sourceId)) {
            if (mapRef.current.getLayer(fillLayerId)) {
                mapRef.current.removeLayer(fillLayerId);
            }
            if (mapRef.current.getLayer(outlineLayerId)) {
                mapRef.current.removeLayer(outlineLayerId);
            }
            mapRef.current.removeSource(sourceId);
        }

        mapRef.current.addSource(`zone-${zone.id}`, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [zonePoints],
                },
                properties: {},
            },
        });

        mapRef.current.addLayer({
            id: `zone-${zone.id}`,
            type: 'fill',
            source: `zone-${zone.id}`,
            layout: {},
            paint: {
                'fill-color': '#088',
                'fill-opacity': 0.5,
            },
        });

        mapRef.current.addLayer({
            id: `zone-${zone.id}-outline`,
            type: 'line',
            source: `zone-${zone.id}`,
            layout: {},
            paint: {
                'line-color': '#000',
                'line-width': 2,
            },
        });
    }

    async function handleZoneSaved() {
        setModalVisible(false);
        setIsDrawingMode(false);
        setEnabledButton(false);

        fetchZones().then((zonesData: Zone[]) => {
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
