import { Asset, Transaction } from "@/types/index";

export const myAssets: Asset[] = [
  { ticker: 'BHIP', name: 'Banco Hipotecario', sector: 'Finanzas', region: 'Argentina' },
  { ticker: 'SAMI', name: 'San Miguel', sector: 'Consumo Defensivo', region: 'Argentina' },
];

export const myTransactions: Transaction[] = [
  { id: '1', ticker: 'BHIP', date: '2025-09-01', type: 'BUY', quantity: 1000, priceArs: 500, priceUsd: 0.4, commission: 50 },
  // Agrega un par más basadas en tus CSVs...
];