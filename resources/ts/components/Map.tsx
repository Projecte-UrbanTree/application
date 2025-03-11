import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MyMap = () => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [viewport, setViewport] = useState({
        latitude: 40.4168,
        longitude: -3.7038,
        zoom: 12,
    });

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [viewport.longitude, viewport.latitude],
            zoom: viewport.zoom,
        });

        const nav = new mapboxgl.NavigationControl();
        mapRef.current.addControl(nav, 'top-right');

        new mapboxgl.Marker({ color: 'red' })
            .setLngLat([viewport.longitude, viewport.latitude])
            .addTo(mapRef.current);

        return () => {
            mapRef.current?.remove();
        };
    }, [viewport]);

    return (
        <div className="w-full h-screen">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
};

export default MyMap;
