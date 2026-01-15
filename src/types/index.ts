export type Sector = 'Finanzas' | 'Energía' | 'Materiales Básicos' | 'Consumo Defensivo' | 'Tecnología' | 'Salud' | 'Bienes Raíces' | 'Holding' | 'ETFs';

export type Region = 'Argentina' | 'EE.UU.' | 'Latinoamérica' | 'Brasil' | 'Europa' | 'Asia';

export interface Asset {
  ticker: string;
  name: string;
  sector: Sector;
  region: Region;
}

export interface Transaction {
  id: string;
  ticker: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  quantity: number;
  priceArs: number;
  priceUsd: number;
  commission: number;
}