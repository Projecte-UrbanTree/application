import type { IResourceType } from './IResourceType';

export interface IResource {
    id: number;
    name: string;
    description?: string;
    resource_type_id: number;
    resource_type?: IResourceType;
    created_at?: string;
    updated_at?: string;
}
