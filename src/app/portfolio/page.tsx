'use client';

import { useState, useEffect } from "react";
import { myAssets, myTransactions } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/types/utils";
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Text, Title, Metric, DonutChart, Legend } from "@tremor/react";

export default function PortfolioPage() {
  // dolar
  const [dolarCCL, setDolarCCL] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Hook para buscar el precio del dólar al cargar la página
  useEffect(() => {
    fetch("https://dolarapi.com/v1/dolares/contadoconliqui")
      .then(res => res.json())
      .then(data => {
        setDolarCCL(data.venta);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando el dólar CCL: ", err);
        setLoading(false);
      })
  })


  // Lógica: Agrupar transacciones por ticker para calcular totales
  // En una App real, esto lo haría una función en un 'hook' o en el backend
  const portfolioData = myAssets.map(asset => {
  const transactions = myTransactions.filter(t => t.ticker === asset.ticker);
  
  const totalQty = transactions.reduce((acc, t) => acc + t.quantity, 0);
  
  // Calculamos el costo promedio en dólares
  const totalInvestedUsd = transactions.reduce((acc, t) => {
    return acc + (t.quantity * t.priceUsd); 
  }, 0);

  // Precio actual (Hardcodeado para probar, simulando que viene de una API)
  const currentPriceUsd = asset.ticker === 'BHIP' ? 1.45 : 0.95; 
  
  const marketValueUsd = totalQty * currentPriceUsd;
  const avgPriceUsd = totalQty > 0 ? totalInvestedUsd / totalQty : 0;
  const pnlPercentage = avgPriceUsd > 0 ? ((currentPriceUsd / avgPriceUsd) - 1) * 100 : 0;
  //const totalPortfolioValue = portfolioData.reduce((acc, item) => acc + item.marketValueUsd, 0);

  return {
    ...asset,
    totalQty,
    avgPriceUsd,
    marketValueUsd,
    pnlPercentage
  };
});

  const totalPortfolioValue = portfolioData.reduce((acc, item) => acc + item.marketValueUsd, 0);
  const totalProfitUsd = portfolioData.reduce((acc, item) => acc + (item.marketValueUsd - (item.totalQty * item.avgPriceUsd)), 0);

  // 1. Agrupamos los datos para el gráfico
  const sectorData = portfolioData.reduce((acc, item) => {
    const existingSector = acc.find(s => s.name === item.sector);
    if (existingSector) {
      existingSector.value += item.marketValueUsd;
    } else {
      acc.push({ name: item.sector, value: item.marketValueUsd });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  return (
    <main className="p-8 bg-indigo-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <Title className="text-2xl">Mi Portfolio de Inversiones</Title>
          <Text>Resumen detallado de activos y rendimientos</Text>
        </header>

        {/* Fila de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card decoration="top" decorationColor="blue">
            <Text>Valor Total Portafolio</Text>
            <Metric>{formatCurrency(totalPortfolioValue, 'USD')}</Metric>
          </Card>
          
          <Card decoration="top" decorationColor="emerald">
            <Text>Ganancia/Pérdida Total</Text>
            <Metric>+ US$ 1.240</Metric> {/* Esto luego lo calcularemos dinámico */}
          </Card>

          <Card decoration="top" decorationColor="amber">
            <Text>Dólar CCL (Hoy)</Text>
            <Metric>
              {loading ? "Cargando..." : formatCurrency(dolarCCL, 'ARS')}
            </Metric>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* El gráfico ocupa 1 columna */}
          <Card className="lg:col-span-1">
            <Title>Distribución por Sector</Title>
            <DonutChart
              className="mt-6 h-40"
              data={sectorData}
              category="value"
              index="name"
              colors={["blue", "cyan", "indigo", "violet", "slate"]}
              valueFormatter={(number) => formatCurrency(number, 'USD')}
            />
            <Legend
              className="mt-3"
              categories={sectorData.map(s => s.name)}
              colors={["blue", "cyan", "indigo", "violet", "slate"]}
            />
          </Card>

          {/* Aquí podés poner otro gráfico o más métricas en las otras 2 columnas */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card decoration="top" decorationColor="blue">
                <Text>Valor Total</Text>
                <Metric>{formatCurrency(totalPortfolioValue, 'USD')}</Metric>
              </Card>
              <Card decoration="top" decorationColor="emerald">
                <Text>Ganancia Total (USD)</Text>
                <Metric>{formatCurrency(totalProfitUsd, 'USD')}</Metric>
              </Card>
          </div>
        </div>

        {/* Tabla de Posiciones */}
        <Card className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Activo</TableHeaderCell>
                <TableHeaderCell>Sector</TableHeaderCell>
                <TableHeaderCell>Región</TableHeaderCell>
                <TableHeaderCell className="text-right">Cantidad</TableHeaderCell>
                <TableHeaderCell className="text-right">Costo Promedio</TableHeaderCell>
                <TableHeaderCell className="text-right">Valor Mercado</TableHeaderCell>
                <TableHeaderCell className="text-right">Rendimiento</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioData.map((item) => (
                <TableRow key={item.ticker}>
                  <TableCell>
                    <div className="font-bold text-slate-900">{item.ticker}</div>
                    <div className="text-xs text-slate-500">{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge color="slate">{item.sector}</Badge>
                  </TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell className="text-right">{item.totalQty}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.avgPriceUsd, 'USD')} 
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.marketValueUsd, 'USD')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={item.pnlPercentage >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                      {formatPercent(item.pnlPercentage)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  );
}