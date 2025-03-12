import type { ResourceType } from './ResourceType';

export interface Resource {
    id: number;
    name: string;
    description?: string;
    resource_type_id: number;
    resource_type?: ResourceType;
    created_at?: string;
    updated_at?: string;
}
