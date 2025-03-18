import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}

const useGeolocation = () => {
    const [location, setLocation] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation((prev) => ({
                ...prev,
                error: 'Geolocation is not supported',
            }));
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
            });
        };

        const error = (err: GeolocationPositionError) => {
            setLocation((prev) => ({ ...prev, error: err.message }));
        };

        const watcher = navigator.geolocation.watchPosition(success, error);

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    return location;
};

export default useGeolocation;
