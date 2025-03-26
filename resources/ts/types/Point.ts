export interface Point {
    id?: number;
    latitude?: number;
    longitude?: number;
    type?: TypePoint;
    zone_id?: number;
    created_at?: null;
    updated_at?: null;
}

export enum TypePoint {
    element = 'element',
    zone_delimiter = 'zone_delimiter',
}
