'use client';

import { Card, Text, Badge } from "@tremor/react";

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
      logo: 'https://www.hipotecario.com.ar/wp-content/uploads/2019/07/logo-hipotecario.svg',
      quantity: 1500, 
      avgPurchasePrice: 1100, 
      currentPrice: 1350 
    },
    { 
      ticker: 'SAMI', 
      name: 'San Miguel', 
      logo: 'https://images.squarespace-cdn.com/content/v1/63eea45262584c3023fb22ed/ad4f4f34-d1b3-4446-bf6a-c001270509bf/summer+San+Miguel+Marca+Logo+Verde.png?format=1500w',
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myAssets.map((asset) => {
              const profit = (asset.currentPrice - asset.avgPurchasePrice) * asset.quantity;
              const isPos = profit >= 0;
              const totalAssetValue = asset.currentPrice * asset.quantity;

              return (
                <Card 
                  key={asset.ticker} 
                  className="bg-slate-900/40 border-slate-800 ring-0 shadow-xl hover:bg-slate-900/60 transition-all group overflow-hidden relative"
                >
                  {/* Gradiente de color según el rendimiento */}
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full -mr-10 -mt-10 ${isPos ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  <div className="flex flex-col h-full justify-between space-y-6">
                    {/* Header de la Card: Logo y Ticker */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
                          <img src={asset.logo} alt={asset.ticker} className="object-contain" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg leading-tight">{asset.ticker}</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{asset.name}</p>
                        </div>
                      </div>
                      <Badge color={isPos ? "emerald" : "rose"} size="xs" className="bg-opacity-10">
                        {isPos ? '↑' : '↓'} {((asset.currentPrice / asset.avgPurchasePrice - 1) * 100).toFixed(2)}%
                      </Badge>
                    </div>

                    {/* Datos de cantidad y precio */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text className="text-[10px] text-slate-500 uppercase font-bold">Tenencia</Text>
                        <p className="text-white font-medium">{asset.quantity} <span className="text-[10px] text-slate-400 font-normal">unidades</span></p>
                      </div>
                      <div className="text-right">
                        <Text className="text-[10px] text-slate-500 uppercase font-bold">Valuación</Text>
                        <p className="text-white font-mono font-bold">{fmt(totalAssetValue)}</p>
                      </div>
                    </div>

                    {/* Resultado económico */}
                    <div className={`pt-4 border-t border-slate-800/50 flex justify-between items-end`}>
                      <div>
                        <Text className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">PPC: <span className="text-slate-400 font-mono italic">{fmt(asset.avgPurchasePrice)}</span></Text>
                        <Text className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Actual: <span className="text-slate-400 font-mono italic">{fmt(asset.currentPrice)}</span></Text>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold leading-none ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? '+' : ''}{fmt(profit)}
                        </p>
                        <Text className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Ganancia / Pérdida</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
