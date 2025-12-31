'use client';

import { useState, useEffect } from 'react';

// Mock data for reports (in a real app, this would come from API)
const mockSalesReport = [
  { date: '2025-11-25', sales: 1200, orders: 30 },
  { date: '2025-11-26', sales: 1500, orders: 35 },
  { date: '2025-11-27', sales: 1300, orders: 28 },
  { date: '2025-11-28', sales: 1800, orders: 40 },
  { date: '2025-11-29', sales: 1600, orders: 32 },
  { date: '2025-11-30', sales: 2000, orders: 45 },
  { date: '2025-12-01', sales: 1750, orders: 38 },
];

const mockProductSales = [
  { name: 'Hamburguer Clássico', count: 150, revenue: 3750 },
  { name: 'Refrigerante Lata', count: 200, revenue: 1400 },
  { name: 'Batata Frita Média', count: 100, revenue: 1200 },
  { name: 'Pizza Calabresa', count: 50, revenue: 2000 },
];

const mockStockAlerts = [
  { ingredient: 'Alface', currentStock: 150, minStock: 200, unit: 'g' },
  { ingredient: 'Tomate', currentStock: 80, minStock: 100, unit: 'un' },
];

export default function ReportsPage() {
  const [salesReport, setSalesReport] = useState(mockSalesReport);
  const [productSales, setProductSales] = useState(mockProductSales);
  const [stockAlerts, setStockAlerts] = useState(mockStockAlerts);

  // In a real application, useEffect would fetch data from backend APIs
  // useEffect(() => {
  //   fetch('/api/reports/sales').then(res => res.json()).then(data => setSalesReport(data));
  //   fetch('/api/reports/product-sales').then(res => res.json()).then(data => setProductSales(data));
  //   fetch('/api/stock/alerts').then(res => res.json()).then(data => setStockAlerts(data));
  // }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Relatórios e Dashboard</h1>

      {/* Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total de Vendas (Últimos 7 dias)</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>R$ {salesReport.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total de Pedidos (Últimos 7 dias)</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{salesReport.reduce((sum, item) => sum + item.orders, 0)}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Ticket Médio</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>
            R$ {(salesReport.reduce((sum, item) => sum + item.sales, 0) / salesReport.reduce((sum, item) => sum + item.orders, 0)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sales Over Time Chart */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Vendas Diárias</h2>
        {/* Placeholder for a chart library (e.g., Chart.js, Recharts) */}
        <div style={{ height: '300px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
          Gráfico de Vendas Aqui
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Dados de vendas dos últimos dias.
        </p>
      </div>

      {/* Top Selling Products */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Produtos Mais Vendidos</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Produto</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Quantidade Vendida</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Faturamento</th>
            </tr>
          </thead>
          <tbody>
            {productSales.sort((a, b) => b.count - a.count).map((product, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{product.name}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{product.count}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>R$ {product.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Alerts */}
      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: stockAlerts.length > 0 ? '#ffebee' : '#fff' }}>
        <h2>Alertas de Estoque</h2>
        {stockAlerts.length === 0 ? (
          <p>Nenhum alerta de estoque no momento. Tudo certo!</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {stockAlerts.map((alert, index) => (
              <li key={index} style={{ marginBottom: '8px', color: 'red', fontWeight: 'bold' }}>
                {alert.ingredient}: Estoque atual {alert.currentStock}{alert.unit} abaixo do mínimo {alert.minStock}{alert.unit}!
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
