'use client';

import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from "@tremor/react";

/* Tipado de datos */
interface Asset {
  ticker: string;
  name: string;
  logo: string;
  quantity: number;
  avgPurchasePrice: number; // Precio promedio de compra (ARS)
  currentPrice: number;     // Precio actual de mercado (ARS)
}

/* Formateador de moneda */
const fmt = (val: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

export default function DarkDashboard() {
  
  // Informaciòn del portafolio
  const myAssets: Asset[] = [
    { 
      ticker: 'BHIP', 
      name: 'Banco Hipotecario', 
      logo: 'https://e7.pngegg.com/pngimages/418/143/png-clipart-banco-hipotecario-s-a-bank-buenos-aires-finance-bank-blue-building-thumbnail.png',
      quantity: 1500, 
      avgPurchasePrice: 1100, 
      currentPrice: 1350 
    },
    { 
      ticker: 'SAMI', 
      name: 'San Miguel', 
      logo: 'https://www.agroislas.com/wp-content/uploads/2021/05/logo-san-miguel.png',
      quantity: 800, 
      avgPurchasePrice: 950, 
      currentPrice: 920 
    },
    { 
      ticker: 'YPF', 
      name: 'YPF', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Logo_de_YPF.svg/500px-Logo_de_YPF.svg.png',
      quantity: 5, 
      avgPurchasePrice: 42000, 
      currentPrice: 48500 
    }
  ];

  /* Calculos */
  const totalInvested = myAssets.reduce((acc, a) => acc + (a.quantity * a.avgPurchasePrice), 0); // Total invertido
  const currentTotalValue = myAssets.reduce((acc, a) => acc + (a.quantity * a.currentPrice), 0); // Valor actual del portafolio
  const totalProfitLoss = currentTotalValue - totalInvested; // Ganancia o perdida total
  const percentageGain = (totalProfitLoss / totalInvested) * 100; // Porcentaje de ganancia o perdida

  /* Render */
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Encabezado */}
        <header>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mi Portafolio</h1>
          <p className="text-slate-500 mt-1">Resumen de activos y rendimiento en tiempo real</p>
        </header>

        {/* Patrimonio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800 ring-0 shadow-xl">
            <Text className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">Patrimonio Actual</Text>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{fmt(currentTotalValue)}</span>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 ring-0 shadow-xl">
            <Text className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">Ganancia / Pérdida Total</Text>
            <div className="mt-2 flex items-center gap-3">
              <span className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {fmt(totalProfitLoss)}
              </span>
              <Badge color={totalProfitLoss >= 0 ? "emerald" : "rose"} size="xs">
                {totalProfitLoss >= 0 ? '↑' : '↓'} {percentageGain.toFixed(2)}%
              </Badge>
            </div>
          </Card>
        </div>

        {/* Activos */}
        <Card className="bg-slate-900/40 border-slate-800 ring-0 shadow-2xl p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white">Detalle de Activos</h3>
          </div>
          <Table>
            <TableHead className="bg-slate-900/60">
              <TableRow className="border-b border-slate-800">
                <TableHeaderCell className="text-slate-400">Activo</TableHeaderCell>
                <TableHeaderCell className="text-slate-400 text-right">Cant.</TableHeaderCell>
                <TableHeaderCell className="text-slate-400 text-right">Compra Avg.</TableHeaderCell>
                <TableHeaderCell className="text-slate-400 text-right">Precio Actual</TableHeaderCell>
                <TableHeaderCell className="text-slate-400 text-right">Resultado</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myAssets.map((asset) => {
                const profit = (asset.currentPrice - asset.avgPurchasePrice) * asset.quantity;
                const isPos = profit >= 0;

                return (
                  <TableRow key={asset.ticker} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                    <TableCell className="flex items-center gap-4 py-5">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                        <img src={asset.logo} alt={asset.ticker} className="object-contain" />
                      </div>
                      <div>
                        <div className="text-white font-bold leading-none">{asset.ticker}</div>
                        <div className="text-[11px] text-slate-500 mt-1 uppercase font-medium">{asset.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-slate-300 font-medium">{asset.quantity}</TableCell>
                    <TableCell className="text-right text-slate-400 font-mono text-xs">{fmt(asset.avgPurchasePrice)}</TableCell>
                    <TableCell className="text-right text-white font-mono font-bold">{fmt(asset.currentPrice)}</TableCell>
                    <TableCell className="text-right">
                      <div className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {fmt(profit)}
                      </div>
                      <div className={`text-[10px] ${isPos ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                        {((asset.currentPrice / asset.avgPurchasePrice - 1) * 100).toFixed(2)}%
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

      </div>
    </div>
  );
}