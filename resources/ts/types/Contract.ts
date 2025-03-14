export interface ContractProps {
    id: number;
    name?: string;
}

export interface Contract {
    id?: number;
    name?: string;
    start_date?: Date;
    end_date?: Date;
    final_price?: number;
    status?: number;
    created_at?: null;
    updated_at?: null;
}
