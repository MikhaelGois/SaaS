'use client';

import { useState, useEffect } from 'react';

// Mock data (in a real app, this would come from API)
const mockTables = [
  { id: 'table1', number: 1, status: 'AVAILABLE', currentOrderId: null },
  { id: 'table2', number: 2, status: 'OCCUPIED', currentOrderId: 'orderA' },
  { id: 'table3', number: 3, status: 'AVAILABLE', currentOrderId: null },
];

const mockOrders = {
    'orderA': {
        id: 'orderA',
        tableId: 'table2',
        items: [
            { id: 'item1', productId: 'prod1', name: 'Hamburguer Clássico', quantity: 2, price: 25.00 },
            { id: 'item2', productId: 'prod3', name: 'Refrigerante Lata', quantity: 3, price: 7.00 },
        ],
        status: 'PENDING',
        totalAmount: 71.00
    }
};

const mockProducts = [
  { id: 'prod1', name: 'Hamburguer Clássico', price: 25.00, category: 'Lanches' },
  { id: 'prod2', name: 'Batata Frita Média', price: 12.00, category: 'Acompanhamentos' },
  { id: 'prod3', name: 'Refrigerante Lata', price: 7.00, category: 'Bebidas' },
  { id: 'prod4', name: 'Pizza Calabresa', price: 40.00, category: 'Pizzas' },
];


export default function ComandeiroPage() {
  const [tables, setTables] = useState(mockTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedTable && selectedTable.currentOrderId) {
      setCurrentOrder(mockOrders[selectedTable.currentOrderId]);
    } else {
      setCurrentOrder(null);
    }
  }, [selectedTable]);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleCreateOrder = (tableId) => {
    const newOrderId = `order${Date.now()}`;
    const newOrder = {
        id: newOrderId,
        tableId: tableId,
        items: [],
        status: 'PENDING',
        totalAmount: 0
    };
    mockOrders[newOrderId] = newOrder; // Add to mock
    setTables(prevTables => prevTables.map(t => t.id === tableId ? { ...t, status: 'OCCUPIED', currentOrderId: newOrderId } : t));
    setSelectedTable(prev => ({ ...prev, status: 'OCCUPIED', currentOrderId: newOrderId }));
    setCurrentOrder(newOrder);
  };

  const handleAddItem = (product) => {
    if (!currentOrder) return;

    setCurrentOrder(prevOrder => {
      const existingItemIndex = prevOrder.items.findIndex(item => item.productId === product.id);
      let updatedItems;

      if (existingItemIndex > -1) {
        updatedItems = prevOrder.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...prevOrder.items, { productId: product.id, name: product.name, quantity: 1, price: product.price }];
      }

      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const updatedOrder = { ...prevOrder, items: updatedItems, totalAmount: newTotal };
      mockOrders[updatedOrder.id] = updatedOrder; // Update mock
      return updatedOrder;
    });
  };

  const handleUpdateItemQuantity = (itemId, newQuantity) => {
    if (!currentOrder) return;

    setCurrentOrder(prevOrder => {
      let updatedItems;
      if (newQuantity <= 0) {
        updatedItems = prevOrder.items.filter(item => item.productId !== itemId);
      } else {
        updatedItems = prevOrder.items.map(item =>
          item.productId === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedOrder = { ...prevOrder, items: updatedItems, totalAmount: newTotal };
      mockOrders[updatedOrder.id] = updatedOrder;
      return updatedOrder;
    });
  };

  const handleChangeOrderStatus = (newStatus) => {
    if (!currentOrder) return;
    setCurrentOrder(prevOrder => {
      const updatedOrder = { ...prevOrder, status: newStatus };
      mockOrders[updatedOrder.id] = updatedOrder;
      return updatedOrder;
    });
    // In a real app, this would send an API call to update status and trigger WebSocket
    console.log(`Order ${currentOrder.id} status changed to ${newStatus}`);
  };

  const handleCloseOrder = () => {
    if (!selectedTable || !currentOrder) return;
    console.log(`Closing order ${currentOrder.id} for table ${selectedTable.number}`);
    // In a real app, this would involve sending to payment or closing out the table
    // For now, just reset
    delete mockOrders[currentOrder.id];
    setTables(prevTables => prevTables.map(t => t.id === selectedTable.id ? { ...t, status: 'AVAILABLE', currentOrderId: null } : t));
    setSelectedTable(null);
    setCurrentOrder(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Table List */}
      <div style={{ flex: 0.8, padding: '20px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Mesas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {tables.map(table => (
            <div
              key={table.id}
              style={{
                border: `1px solid ${selectedTable?.id === table.id ? 'blue' : '#ddd'}`,
                padding: '15px',
                borderRadius: '5px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: table.status === 'OCCUPIED' ? '#ffe0b2' : '#e8f5e9'
              }}
              onClick={() => handleSelectTable(table)}
            >
              <h3>Mesa {table.number}</h3>
              <p>{table.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Management */}
      <div style={{ flex: 2, padding: '20px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Gerenciar Pedido</h2>
        {selectedTable ? (
          <div>
            <h3>Mesa Selecionada: {selectedTable.number} ({selectedTable.status})</h3>
            {!currentOrder && selectedTable.status === 'AVAILABLE' && (
              <button onClick={() => handleCreateOrder(selectedTable.id)} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}>
                Abrir Comanda
              </button>
            )}

            {currentOrder && (
              <div>
                <h4>Pedido #{currentOrder.id} (Status: {currentOrder.status})</h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', marginBottom: '15px' }}>
                  {currentOrder.items.length === 0 ? <p>Nenhum item no pedido.</p> :
                  currentOrder.items.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span>{item.name} ({item.price.toFixed(2)}) x </span>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQuantity(item.productId, parseInt(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', marginRight: '10px' }}
                      />
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <h3>Total do Pedido: R$ {currentOrder.totalAmount.toFixed(2)}</h3>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleChangeOrderStatus('PREPARING')} style={{ padding: '8px 15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '3px' }}>Preparando</button>
                    <button onClick={() => handleChangeOrderStatus('READY')} style={{ padding: '8px 15px', background: '#FFC107', color: 'black', border: 'none', borderRadius: '3px' }}>Pronto</button>
                    <button onClick={() => handleChangeOrderStatus('SERVED')} style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}>Servido</button>
                    <button onClick={handleCloseOrder} style={{ padding: '8px 15px', background: '#F44336', color: 'white', border: 'none', borderRadius: '3px' }}>Fechar Comanda</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Selecione uma mesa para gerenciar os pedidos.</p>
        )}
      </div>

      {/* Product List for Adding to Order */}
      <div style={{ flex: 1.2, padding: '20px', borderLeft: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Produtos</h2>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
          {filteredProducts.map(product => (
            <button
              key={product.id}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                cursor: currentOrder ? 'pointer' : 'not-allowed',
                backgroundColor: currentOrder ? '#fff' : '#f0f0f0'
              }}
              onClick={() => currentOrder && handleAddItem(product)}
              disabled={!currentOrder}
            >
              <h3>{product.name}</h3>
              <p>R$ {product.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
