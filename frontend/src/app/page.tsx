'use client';

import { useState } from 'react';

// Mock data (in a real app, this would come from API)
const mockProducts = [
  { id: 'prod1', name: 'Hamburguer Clássico', price: 25.00, category: 'Lanches' },
  { id: 'prod2', name: 'Batata Frita Média', price: 12.00, category: 'Acompanhamentos' },
  { id: 'prod3', name: 'Refrigerante Lata', price: 7.00, category: 'Bebidas' },
  { id: 'prod4', name: 'Pizza Calabresa', price: 40.00, category: 'Pizzas' },
  { id: 'prod5', name: 'Café Expresso', price: 5.00, category: 'Bebidas' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function PDVPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null); // For saloon orders
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' }); // For delivery

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof mockProducts[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== id);
      }
      return prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    // In a real application, this would interact with the backend API
    console.log('Placing order:', {
      cart,
      total: calculateTotal(),
      table: selectedTable,
      customerInfo,
    });
    alert('Pedido simulado realizado! Verifique o console.');
    setCart([]); // Clear cart after placing order
    setSelectedTable(null);
    setCustomerInfo({ name: '', phone: '', address: '' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Product List / Search */}
      <div style={{ flex: 2, padding: '20px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <h2>Produtos</h2>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => addToCart(product)}>
              <h3>{product.name}</h3>
              <p>R$ {product.price.toFixed(2)}</p>
              <small>{product.category}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Order Cart */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2>Comanda</h2>
        {cart.length === 0 ? (
          <p>Carrinho vazio.</p>
        ) : (
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
                <div>
                  <p>{item.name}</p>
                  <small>R$ {item.price.toFixed(2)} cada</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} style={{ padding: '5px 10px', marginRight: '5px' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} style={{ padding: '5px 10px', marginLeft: '5px' }}>+</button>
                  <button onClick={() => removeFromCart(item.id)} style={{ padding: '5px 10px', marginLeft: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '3px' }}>X</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Total: R$ {calculateTotal().toFixed(2)}</h3>

          <div style={{ marginBottom: '15px' }}>
            <h4>Tipo de Pedido:</h4>
            <select style={{ width: '100%', padding: '8px' }}>
              <option value="SALOON">Salão</option>
              <option value="COUNTER">Balcão</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>

          {/* Table selection for Saloon (mock) */}
          <div style={{ marginBottom: '15px' }}>
            <h4>Mesa (Salão):</h4>
            <select value={selectedTable || ''} onChange={(e) => setSelectedTable(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">Selecionar Mesa</option>
              <option value="table1">Mesa 1</option>
              <option value="table2">Mesa 2</option>
              <option value="table3">Mesa 3</option>
            </select>
          </div>

          {/* Customer info for Delivery (mock) */}
          <div style={{ marginBottom: '15px' }}>
            <h4>Informações do Cliente (Delivery):</h4>
            <input type="text" placeholder="Nome" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '5px' }} />
            <input type="text" placeholder="Telefone" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '5px' }} />
            <input type="text" placeholder="Endereço" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>


          <button
            onClick={handlePlaceOrder}
            style={{ width: '100%', padding: '15px', fontSize: '1.2em', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Finalizar Pedido (R$ {calculateTotal().toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}