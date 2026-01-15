import { myAssets, myTransactions } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/types/utils";
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Text, Title } from "@tremor/react";

export default function PortfolioPage() {
  // Lógica: Agrupar transacciones por ticker para calcular totales
  // En una App real, esto lo haría una función en un 'hook' o en el backend
  const portfolioData = myAssets.map(asset => {
    const transactions = myTransactions.filter(t => t.ticker === asset.ticker);
    
    const totalQty = transactions.reduce((acc, t) => acc + t.quantity, 0);
    const totalInvestedArs = transactions.reduce((acc, t) => acc + (t.quantity * t.priceArs) + t.commission, 0);
    
    // Precio actual (Hardcodeado por ahora, luego vendrá de una API)
    const currentPriceArs = asset.ticker === 'BHIP' ? 1347 : 1100; 
    const marketValueArs = totalQty * currentPriceArs;
    const pnlPercentage = ((marketValueArs / totalInvestedArs) - 1) * 100;

    return {
      ...asset,
      totalQty,
      avgPrice: totalInvestedArs / totalQty,
      marketValueArs,
      pnlPercentage
    };
  });

  const totalPortfolioValue = portfolioData.reduce((acc, item) => acc + item.marketValueArs, 0);

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <Title className="text-2xl">Mi Portfolio de Inversiones</Title>
          <Text>Resumen detallado de activos y rendimientos</Text>
        </header>

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
                  <TableCell className="text-right">{formatCurrency(item.avgPrice, 'ARS')}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.marketValueArs, 'ARS')}
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