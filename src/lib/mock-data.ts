import { Asset, Transaction } from "@/types";

export const myAssets: Asset[] = [
  { ticker: 'BHIP', name: 'Banco Hipotecario', sector: 'Finanzas', region: 'Argentina' },
  { ticker: 'SAMI', name: 'San Miguel', sector: 'Consumo Defensivo', region: 'Argentina' },
  { ticker: 'VIST', name: 'Vista Energy', sector: 'Energía', region: 'Argentina' },
];

export const myTransactions: Transaction[] = [
  { 
    id: '1', 
    ticker: 'BHIP', 
    date: '2024-12-10', 
    type: 'BUY', 
    quantity: 100, 
    priceArs: 1300,  // Precio en pesos al comprar
    priceUsd: 1.10,  // Precio en dólares al comprar (CCL/MEP del día)
    commission: 50   // Comisión del broker en pesos
  },
  { 
    id: '2', 
    ticker: 'SAMI', 
    date: '2024-12-15', 
    type: 'BUY', 
    quantity: 50, 
    priceArs: 900, 
    priceUsd: 0.80, 
    commission: 30 
  }
];