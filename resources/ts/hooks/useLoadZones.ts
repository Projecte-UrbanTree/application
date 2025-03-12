import { useEffect, useState } from 'react';
import { fetchZones } from '@/api/service/zoneService';
import { fetchPoints } from '@/api/service/pointService';
import { Zone } from '@/types/zone';
import { Point } from '@/types/point';

export function useLoadZones(mapRef: React.RefObject<mapboxgl.Map | null>) {
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        if (!mapRef.current) return;

        fetchZones().then((zonesData: Zone[]) => {
            setZones(zonesData);
            fetchPoints().then((allPoints: Point[]) => {
                zonesData.forEach((zone) => {
                    const zonePoints: [number, number][] = allPoints
                        .filter((point) => point.zone_id === zone.id)
                        .map((point) => [
                            point.longitude as number,
                            point.latitude as number,
                        ]) as [number, number][];

                    if (zonePoints.length > 2) {
                        zonePoints.push(zonePoints[0]);
                        addZoneToMap(mapRef, zone, zonePoints);
                    }
                });
            });
        });
    }, [mapRef]);

    return { zones };
}

function addZoneToMap(
    mapRef: React.RefObject<mapboxgl.Map | null>,
    zone: Zone,
    zonePoints: [number, number][],
) {
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

    if (mapRef.current) {
        mapRef.current.addSource(`zone-${zone.id}`, {
            type: 'geojson',
            data: geoJsonZone,
        });

        mapRef.current.addLayer({
            id: `zone-layer-${zone.id}`,
            type: 'fill',
            source: `zone-${zone.id}`,
            paint: {
                'fill-color': zone.color || '#ff0000',
                'fill-opacity': 0.5,
            },
        });

        mapRef.current.addLayer({
            id: `zone-border-${zone.id}`,
            type: 'line',
            source: `zone-${zone.id}`,
            paint: { 'line-color': '#000000', 'line-width': 2 },
        });
    }
}
