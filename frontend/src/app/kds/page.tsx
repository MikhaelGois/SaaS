'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Assuming socket.io-client is available
import { OrderStatus } from '../../../../backend/prisma/schema.prisma'; // Assuming shared enum

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Replace with your backend WebSocket URL

// Mock order data (in a real app, this would be fetched from API and updated via WebSocket)
const initialOrders = [
  {
    id: 'order1',
    orderNumber: '001',
    type: 'SALOON',
    table: { number: 5 },
    items: [
      { id: 'item1', name: 'Hamburguer Clássico', quantity: 2 },
      { id: 'item2', name: 'Batata Frita', quantity: 1 },
    ],
    status: OrderStatus.PENDING,
    createdAt: new Date(),
  },
  {
    id: 'order2',
    orderNumber: '002',
    type: 'DELIVERY',
    customerName: 'João Silva',
    items: [
      { id: 'item3', name: 'Pizza Calabresa', quantity: 1 },
      { id: 'item4', name: 'Refrigerante', quantity: 2 },
    ],
    status: OrderStatus.PREPARING,
    createdAt: new Date(Date.now() - 60000 * 10), // 10 minutes ago
  },
];

export default function KDSPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server for KDS');
    });

    newSocket.on('orderStatusUpdated', (updatedOrderData: { orderId: string; status: OrderStatus }) => {
      console.log('Received order status update:', updatedOrderData);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrderData.orderId ? { ...order, status: updatedOrderData.status } : order
        )
      );
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server for KDS');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // In a real application, this would typically be an API call to the backend
    // which then updates the database and emits the WebSocket event.
    // For this mock, we'll simulate the backend emitting the event.
    console.log(`Simulating backend update for order ${orderId} to status ${newStatus}`);
    if (socket) {
        // Emit an event that the backend OrderGateway is listening for.
        // The backend would then process this and re-emit 'orderStatusUpdated' to all KDS clients.
        socket.emit('updateOrderStatus', { orderId, status: newStatus });
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '#FFC107'; // Yellow
      case OrderStatus.PREPARING:
        return '#2196F3'; // Blue
      case OrderStatus.READY:
        return '#4CAF50'; // Green
      case OrderStatus.SERVED:
      case OrderStatus.COMPLETED:
        return '#9E9E9E'; // Gray
      case OrderStatus.CANCELLED:
        return '#F44336'; // Red
      default:
        return '#ccc';
    }
  };

  const calculateTimeElapsed = (createdAt: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(createdAt).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    if (diffHours > 0) {
      return `${diffHours}h ${remainingMinutes}m atrás`;
    }
    return `${diffMinutes}m atrás`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Kitchen Display System (KDS)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {orders.filter(order => order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED).map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2>Pedido #{order.orderNumber}</h2>
              <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8em' }}>
                {order.status}
              </span>
            </div>
            <p><strong>Tipo:</strong> {order.type} {order.table ? `(Mesa ${order.table.number})` : ''}</p>
            {order.customerName && <p><strong>Cliente:</strong> {order.customerName}</p>}
            <p><strong>Tempo:</strong> {calculateTimeElapsed(order.createdAt)}</p>
            <h3 style={{ marginTop: '10px' }}>Itens:</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {order.items.map(item => (
                <li key={item.id}>{item.quantity}x {item.name}</li>
              ))}
            </ul>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {order.status !== OrderStatus.PREPARING && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.PREPARING)}
                  style={{ padding: '8px 12px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Preparando
                </button>
              )}
              {order.status !== OrderStatus.READY && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.READY)}
                  style={{ padding: '8px 12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Pronto
                </button>
              )}
              {/* Optional: button to mark as served/delivered, which would remove it from KDS view */}
              {order.status === OrderStatus.READY && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.SERVED)}
                  style={{ padding: '8px 12px', background: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Servido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
