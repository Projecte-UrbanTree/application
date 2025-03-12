import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Roles } from '@/types/role';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useInitializeMap(
    mapContainerRef: React.RefObject<HTMLDivElement | null>,
) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
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
                controls: { polygon: true, trash: true },
            });
            mapRef.current.addControl(drawRef.current);
        }

        return () => mapRef.current?.remove();
    }, []);

    return { mapRef, drawRef };
}
