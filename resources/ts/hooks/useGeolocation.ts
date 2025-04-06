import { useCallback, useEffect, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const useGeolocation = (watch: boolean = true) => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setLocation((prev) => ({ ...prev, error: err.message }));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported',
      }));
      return;
    }

    let watcherId: number | null = null;

    if (watch) {
      watcherId = navigator.geolocation.watchPosition(
        updatePosition,
        handleError,
      );
    } else {
      navigator.geolocation.getCurrentPosition(updatePosition, handleError);
    }

    return () => {
      if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, [watch, updatePosition, handleError]);

  // Expose a function to manually refresh location
  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updatePosition, handleError);
    }
  };

  return { ...location, refreshLocation };
};

export default useGeolocation;
