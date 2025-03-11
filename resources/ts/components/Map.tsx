import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import useGeolocation from '@/hooks/useGeolocation';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const { latitude, longitude, error } = useGeolocation();
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || latitude === null || longitude === null)
            return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        if (mapRef.current) {
            mapRef.current.setCenter([longitude, latitude]);
            return;
        }

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/standard-satellite',
            center: [longitude, latitude],
            zoom: 12,
        });

        return () => mapRef.current?.remove();
    }, [latitude, longitude]);

    return (
        <div
            ref={mapContainerRef}
            style={{
                width: '60vw',
                height: '62vh',
                position: 'relative',
                top: 0,
                left: 0,
            }}
        />
    );
};

export default MapComponent;
