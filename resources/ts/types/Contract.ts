export enum ContractStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

export interface Contract {
  id?: number;
  name: string;
  start_date?: Date;
  end_date?: Date;
  final_price?: number;
  status: number;
  created_at?: null;
  updated_at?: null;
}
